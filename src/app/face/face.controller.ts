import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { Controller } from '@nestjs/common';
import { RpcBody, RpcFile, RpcParam, RpcUserId } from 'src/common/decorators';
import { MessagePattern } from '@nestjs/microservices';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @MessagePattern('ekyc.face.add')
  addFace(
    @RpcUserId() userId: string,
    @RpcParam('requestId') requestId: string,
    @RpcBody() body: CreateFaceDto,
    @RpcFile() file: Express.Multer.File,
  ) {
    return this.faceService.addFace(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }

  @MessagePattern('ekyc.video.selfie.add')
  addVideoSelfie(
    @RpcUserId() userId: string,
    @RpcParam('requestId') requestId: string,
    @RpcBody() body: CreateFaceDto,
    @RpcFile() file: Express.Multer.File,
  ) {
    return this.faceService.addVideoSelfie(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }
}
