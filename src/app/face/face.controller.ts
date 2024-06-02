import { FaceService } from './face.service';
import { GetCurrentUserId } from 'src/core/decorators';
import { CreateFaceDto } from './dto/create-face.dto';
import {
  Controller,
  Post,
  Param,
  Body,
  UploadedFile,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post(':requestId/add-face')
  @UseInterceptors(FileInterceptor('file'))
  addFace(
    @GetCurrentUserId() userId: string,
    @Param('requestId') requestId: string,
    @Body() body: CreateFaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.faceService.addFace(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }

  @Post(':requestId/add-video-selfie')
  @UseInterceptors(FileInterceptor('file'))
  addVideoSelfie(
    @GetCurrentUserId() userId: string,
    @Param('requestId') requestId: string,
    @Body() body: CreateFaceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.faceService.addVideoSelfie(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }
}
