import { Controller } from '@nestjs/common';
import { RequestService } from './request.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { RpcBody, RpcParam, RpcUserId } from 'src/common/decorators';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @MessagePattern('ekyc.request.get-or-create')
  getLatestUnfinishedRequestOrCreate(@RpcUserId() userId: string) {
    return this.requestService.getLatestUnfinishedRequestOrCreate(userId);
  }

  @MessagePattern('ekyc.request.submit')
  submitRequest(
    @RpcUserId() userId: string,
    @RpcParam('id') requestId: string,
  ) {
    return this.requestService.submitRequest(userId, requestId);
  }

  @MessagePattern('ekyc.request.get-by-id')
  findOne(@RpcUserId() userId: string, @RpcParam('id') id: string) {
    return this.requestService.findById(userId, id);
  }

  @MessagePattern('ekyc.request.accept')
  acceptRequest(@RpcParam('id') requestId: string) {
    return this.requestService.acceptRequest(requestId);
  }

  @MessagePattern('ekyc.request.reject')
  rejectRequest(
    @RpcParam('id') requestId: string,
    @RpcBody()
    body: {
      reason: string;
    },
  ) {
    return this.requestService.rejectRequest(requestId, body.reason);
  }

  @MessagePattern('ekyc.request.get-all')
  findAll() {
    return this.requestService.findAll();
  }
}
