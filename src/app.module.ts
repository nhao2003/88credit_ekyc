import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './app/file/file.module';
import { OcrModule } from './app/ocr/ocr.module';
import { FaceModule } from './app/face/face.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConstants } from './common/constants/env/env.constants';
import { EkycModule } from './app/ekyc/ekyc.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestModule } from './app/request/request.module';
import { TransformationInterceptor } from './core/interceptors';
import { AccessTokenJwtGuard } from './core/guards';
import { AccessTokenStrategy } from './core/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(EnvConstants.mongoUri),
        dbName: '88credit_ekyc',
      }),
      inject: [ConfigService],
    }),
    EkycModule,
    FileModule,
    OcrModule,
    FaceModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    AccessTokenStrategy,
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenJwtGuard,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformationInterceptor,
    },
  ],
})
export class AppModule {}
