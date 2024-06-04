import { Controller } from '@nestjs/common';
import { RequestService } from './request.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcParam, RpcUserId } from 'src/common/decorators';

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
}
