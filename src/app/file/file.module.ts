import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { EkycFile, EkycFileSchema } from 'src/core/schema/ekyc-file.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EkycFile.name,
        schema: EkycFileSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
