import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { GetCurrentUserId } from 'src/core/decorators';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('latest')
  getLatestUnfinishedRequestOrCreate(@GetCurrentUserId() userId: string) {
    return this.requestService.getLatestUnfinishedRequestOrCreate(userId);
  }

  @Post(':id/submit')
  submitRequest(
    @GetCurrentUserId() userId: string,
    @Param('id') requestId: string,
  ) {
    return this.requestService.submitRequest(userId, requestId);
  }

  @Get(':id')
  findOne(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.requestService.findById(userId, id);
  }

  @Post(':id/accept')
  acceptRequest(@Param('id') requestId: string) {
    return this.requestService.acceptRequest(requestId);
  }

  @Post(':id/reject')
  rejectRequest(
    @Param('id') requestId: string,
    @Body()
    body: {
      reason: string;
    },
  ) {
    return this.requestService.rejectRequest(requestId, body.reason);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }
}
