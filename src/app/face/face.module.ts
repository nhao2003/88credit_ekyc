import { Module } from '@nestjs/common';
import { FaceService } from './face.service';
import { FaceController } from './face.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EkycFile, EkycFileSchema } from 'src/core/schema/ekyc-file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EkycFile.name,
        schema: EkycFileSchema,
      },
    ]),
  ],
  controllers: [FaceController],
  providers: [FaceService],
})
export class FaceModule {}
