import { Module, Global, DynamicModule } from '@nestjs/common';
import { EkycService, EkycServiceConfig } from './ekyc.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvConstants } from 'src/common/constants/env/env.constants';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: EkycService,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        return new EkycService(httpService, {
          ekycBaseUrl: configService.get<string>(EnvConstants.ekycBaseUrl),
          ekycAccessToken: configService.get<string>(
            EnvConstants.ekycAccessToken,
          ),
          ekycTokenId: configService.get<string>(EnvConstants.ekycTokenId),
          ekycTokenKey: configService.get<string>(EnvConstants.ekycTokenKey),
        });
      },
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [EkycService],
})
export class EkycModule {}
