import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs/docs/swagger.config';
import { EnvConstants } from './common/constants/env/env.constants';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { WsGuard } from './core/guards';
import { JwtService } from '@nestjs/jwt';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfig.config(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>(EnvConstants.port);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
