import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaceDto } from './dto/create-face.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EkycFile } from 'src/core/schema/ekyc-file.schema';
import { EkycRequest, EkycStatus } from 'src/core/schema/ekyc-request.schema';
import { FileService } from '../file/file.service';
import { EkycFileType } from '../ekyc/enum/enum';

@Injectable()
export class FaceService {
  constructor(
    @InjectModel(EkycRequest.name)
    private readonly ekycRequest: Model<EkycRequest>,
    private readonly fileService: FileService,
  ) {}
  private async findRequest(userId: string, requestId: string) {
    const request = await this.ekycRequest.findOne({
      _id: requestId,
      userId,
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.status !== EkycStatus.initiated) {
      throw new BadRequestException('Request has been submitted');
    }
    return request;
  }
  async addFace(userId: string, requestId: string, file: CreateFaceDto) {
    const request = await this.findRequest(userId, requestId);
    const fileUploaded = await this.fileService.addFile({
      title: file.title,
      description: file.description,
      file: file.file,
      userId,
      type: EkycFileType.face,
    });
    request.face = fileUploaded.id;
    // return (await (await request.save()).populate('face'))
    //   .populate('frontIdentityCard')
    //   .populate('backIdentityCard');
    return request.save();
  }

  async addVideoSelfie(userId: string, requestId: string, file: CreateFaceDto) {
    const request = await this.findRequest(userId, requestId);
    const url = await this.fileService.addVideo({
      title: file.title,
      description: file.description,
      file: file.file,
      userId,
      type: EkycFileType.videoSelfie,
    });
    return request.save();
  }
}
