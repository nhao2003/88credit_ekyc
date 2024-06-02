import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EkycRequest,
  EkycRequestSchema,
} from 'src/core/schema/ekyc-request.schema';
import { FileModule } from '../file/file.module';
import { EkycModule } from '../ekyc/ekyc.module';

@Module({
  imports: [
    EkycModule,
    FileModule,
    MongooseModule.forFeature([
      {
        name: EkycRequest.name,
        schema: EkycRequestSchema,
      },
    ]),
  ],
  controllers: [OcrController],
  providers: [OcrService],
})
export class OcrModule {}
