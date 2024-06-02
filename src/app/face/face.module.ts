import { Module } from '@nestjs/common';
import { FaceService } from './face.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EkycFile, EkycFileSchema } from 'src/core/schema/ekyc-file.schema';
import {
  EkycRequest,
  EkycRequestSchema,
} from 'src/core/schema/ekyc-request.schema';
import { FileModule } from '../file/file.module';
import { FaceController } from './face.controller';
import { EkycModule } from '../ekyc/ekyc.module';

@Module({
  imports: [
    EkycModule,
    MongooseModule.forFeature([
      {
        name: EkycFile.name,
        schema: EkycFileSchema,
      },
      {
        name: EkycRequest.name,
        schema: EkycRequestSchema,
      },
    ]),
    FileModule,
  ],
  controllers: [FaceController],
  providers: [FaceService],
})
export class FaceModule {}
