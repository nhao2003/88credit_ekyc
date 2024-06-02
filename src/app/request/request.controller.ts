import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { GetCurrentUserId } from 'src/core/decorators';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  getLatestUnfinishedRequestOrCreate(@GetCurrentUserId() userId: string) {
    return this.requestService.getLatestUnfinishedRequestOrCreate(userId);
  }

  @Post('submit/:id')
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
}
