import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EkycRequest,
  EkycRequestSchema,
} from 'src/core/schema/ekyc-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EkycRequest.name,
        schema: EkycRequestSchema,
      },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
