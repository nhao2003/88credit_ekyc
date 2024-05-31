import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './app/file/file.module';
import { OcrModule } from './app/ocr/ocr.module';
import { FaceModule } from './app/face/face.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConstants } from './common/constants/env/env.constants';
import { EkycModule } from './app/ekyc/ekyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EkycModule,
    FileModule,
    OcrModule,
    FaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
