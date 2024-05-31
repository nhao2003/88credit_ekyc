import { ConfigService } from '@nestjs/config';

abstract class EnvConstants {
  public static readonly env = 'ENV';
  public static readonly isProduction = 'IS_PRODUCTION';
  public static readonly isDevelopment = 'IS_DEVELOPMENT';
  public static readonly port = 'PORT';
  public static readonly mongoUri = 'MONGO_URI';
  public static readonly accessTokenSecret = 'ACCESS_TOKEN_SECRET';

  public static ekycBaseUrl = 'EKYC_BASE_URL';
  public static ekycAccessToken = 'EKYC_ACCESS_TOKEN';
  public static ekycTokenId = 'EKYC_TOKEN_ID';
  public static ekycTokenKey = 'EKYC_TOKEN_KEY';
}

export { EnvConstants };
