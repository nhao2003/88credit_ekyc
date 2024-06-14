import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { EkycRequest, EkycStatus } from 'src/core/schema/ekyc-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EkycService } from '../ekyc/ekyc.service';
import { EkycFile } from 'src/core/schema/ekyc-file.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(EkycRequest.name)
    private readonly ekycRequestModel: Model<EkycRequest>,
    private readonly ekycService: EkycService,
    @Inject('88Credit_server') private readonly client: ClientProxy,
  ) {}
  private create(userId: string) {
    return this.ekycRequestModel.create({ userId });
  }

  async getLatestUnfinishedRequestOrCreate(userId: string) {
    const approvedRequest = await this.ekycRequestModel.findOne({
      userId,
      status: EkycStatus.approved,
    });
    if (approvedRequest) {
      throw new BadRequestException('User already have approved request', {
        cause: approvedRequest,
        description: 'User already have approved request',
      });
    }
    const request = await this.ekycRequestModel
      .findOne({ userId, status: EkycStatus.initiated })
      .sort({ createdAt: -1 });
    if (request) {
      return request;
    }
    return this.create(userId);
  }

  async submitRequest(userId: string, requestId: string) {
    const request = await this.ekycRequestModel.findOne({
      _id: requestId,
      userId,
    });
    if (!request) {
      throw new NotFoundException('Ekyc request not found');
    }
    if (request.status !== EkycStatus.initiated) {
      throw new NotFoundException('Ekyc request has been submitted');
    }

    if (
      !request.backIdentityCard ||
      !request.frontIdentityCard ||
      !request.face
    ) {
      throw new BadRequestException('Missing required files for ekyc', {
        cause: {
          backIdentityCard: request.backIdentityCard,
          frontIdentityCard: request.frontIdentityCard,
          face: request.face,
        },
        description: 'Missing required files for ekyc',
      });
    }
    const faceComparisonResult = await this.ekycService.faceCompareToDocument({
      client_session:
        'IOS_iphone6plus_ios13_Device_1.3.6_CC332797-E3E5-475F-8546-C9C4AA348837_1581429032',
      img_front: (request.frontIdentityCard as EkycFile).hash,
      img_face: (request.face as EkycFile).hash,
      token: (request.face as EkycFile).tokenId,
    });
    if (faceComparisonResult.object.msg === 'NOMATCH') {
      throw new BadRequestException('Face does not match with document', {
        cause: faceComparisonResult.object,
        description: 'Face does not match with document',
      });
    }
    request.faceComparisonResult = faceComparisonResult.object;
    request.status = EkycStatus.approved;
    this.client.send('user.verified', {
      userId: request.userId,
    });
    return request.save();
  }

  async findById(userId: string, requestId: string) {
    const request = await this.ekycRequestModel.findOne({
      _id: requestId,
      userId,
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  async acceptRequest(requestId: string) {
    const request = await this.ekycRequestModel.findOne({
      _id: requestId,
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    request.status = EkycStatus.approved;
    request.approvedAt = new Date();
    this.client.emit('ekyc.request.accept', {
      userId: request.userId,
    });
    return request.save();
  }

  async rejectRequest(requestId: string, reason: string) {
    const request = await this.ekycRequestModel.findOne({
      _id: requestId,
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    request.status = EkycStatus.rejected;
    request.reason = reason;
    this.client.emit('ekyc.request.reject', {
      userId: request.userId,
      reason: request.reason,
    });
    return request.save();
  }

  findAll() {
    return this.ekycRequestModel.find();
  }
}
