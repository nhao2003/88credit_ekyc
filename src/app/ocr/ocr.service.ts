import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageOcrDto } from './dto/create-ocr.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EkycService } from '../ekyc/ekyc.service';
import { EkycFrontImageType } from '../ekyc/types/image-extract-request.type';
import { EkycRequest, EkycStatus } from 'src/core/schema/ekyc-request.schema';
import { FileService } from '../file/file.service';
import { EkycFileType } from '../ekyc/enum/enum';

@Injectable()
export class OcrService {
  constructor(
    private readonly ekycService: EkycService,
    private readonly fileService: FileService,
    @InjectModel(EkycRequest.name)
    private readonly ekycRequest: Model<EkycRequest>,
  ) {}

  private async findRequest(userId: string, requestId: string) {
    const request = await this.ekycRequest
      .findOne({
        _id: requestId,
        userId,
      })
      .populate('frontIdentityCard')
      .populate('backIdentityCard');
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.status !== EkycStatus.initiated) {
      throw new BadRequestException('Request has been submitted');
    }
    return request;
  }

  async extractFrontImage(
    userId: string,
    requestId: string,
    file: ImageOcrDto,
  ): Promise<EkycRequest> {
    const request = await this.findRequest(userId, requestId);
    const fileUploaded = await this.fileService.addFile({
      title: file.title,
      description: file.description,
      file: file.file,
      userId,
      type: EkycFileType.frontIdentityCard,
    });
    const frontImageResponse = await this.ekycService.extractFrontImage({
      img_front: fileUploaded.hash,
      type: EkycFrontImageType.CMND,
      client_session:
        'IOS_iphone6plus_ios13_Device_1.3.6_CC332797-E3E5-475F-8546-C9C4AA348837_1581429032',
      token: fileUploaded.tokenId,
      validate_postcode: true,
    });
    request.frontIdentityCard = fileUploaded.id;
    request.frontIdentityCardOcrResult = frontImageResponse.object;
    return request.save();
  }

  async extractBackImage(
    userId: string,
    requestId: string,
    file: ImageOcrDto,
  ): Promise<EkycRequest> {
    const request = await this.findRequest(userId, requestId);
    const fileUploaded = await this.fileService.addFile({
      title: file.title,
      description: file.description,
      file: file.file,
      userId,
      type: EkycFileType.backIdentityCard,
    });
    const backImageResponse = await this.ekycService.extractBackImage({
      img_back: fileUploaded.hash,
      type: EkycFrontImageType.CMND,
      client_session:
        'IOS_iphone6plus_ios13_Device_1.3.6_CC332797-E3E5-475F-8546-C9C4AA348837_1581429032',
      token: fileUploaded.tokenId,
    });
    request.backIdentityCard = fileUploaded.id;
    request.backIdentityCardOcrResult = backImageResponse.object;
    return request.save();
  }
}
