import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RpcBody, RpcFile, RpcParam, RpcUserId } from 'src/common/decorators';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/core/decorators';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}
  @Post(':requestId/add')
  @UseInterceptors(FileInterceptor('file'))
  async addFace(
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

  @Post('video-selfie/add')
  @UseInterceptors(FileInterceptor('file'))
  async addVideoSelfie(
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
