import { Module, Global } from '@nestjs/common';
import { EkycService, EkycServiceImpl, MockEkycService } from './ekyc.service';
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
        console.log({
          ekycBaseUrl: configService.get<string>(EnvConstants.ekycBaseUrl),
          ekycAccessToken: configService.get<string>(
            EnvConstants.ekycAccessToken,
          ),
          ekycTokenId: configService.get<string>(EnvConstants.ekycTokenId),
          ekycTokenKey: configService.get<string>(EnvConstants.ekycTokenKey),
        });
        // return new EkycServiceImpl(httpService, {
        //   ekycBaseUrl: configService.get<string>(EnvConstants.ekycBaseUrl),
        //   ekycAccessToken: configService.get<string>(
        //     EnvConstants.ekycAccessToken,
        //   ),
        //   ekycTokenId: configService.get<string>(EnvConstants.ekycTokenId),
        //   ekycTokenKey: configService.get<string>(EnvConstants.ekycTokenKey),
        // });
        return new MockEkycService();
      },
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [EkycService],
})
export class EkycModule {}
