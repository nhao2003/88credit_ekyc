import { Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
class DatabaseConfig extends MongooseModule {
  static config(uri: string) {
    return MongooseModule.forRoot(uri);
  }
}

export { DatabaseConfig };
