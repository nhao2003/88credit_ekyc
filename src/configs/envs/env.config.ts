import { ConfigModule } from '@nestjs/config';

class EnvConfigs extends ConfigModule {
  static config() {
    return ConfigModule.forRoot({
      envFilePath: '.env',
    });
  }
}

export { EnvConfigs };
