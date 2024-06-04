import { Controller } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { ImageOcrDto } from './dto/create-ocr.dto';
import { MessagePattern } from '@nestjs/microservices';
import { RpcBody, RpcFile, RpcParam, RpcUserId } from 'src/common/decorators';

@Controller()
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @MessagePattern('ekyc.ocr.front-id-card')
  extractFrontImage(
    @RpcUserId() userId: string,
    @RpcParam('requestId') requestId: string,
    @RpcBody() body: ImageOcrDto,
    @RpcFile() file: Express.Multer.File,
  ) {
    return this.ocrService.extractFrontImage(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }

  @MessagePattern('ekyc.ocr.back-id-card')
  extractBackImage(
    @RpcUserId() userId: string,
    @RpcParam('requestId') requestId: string,
    @RpcBody() body: ImageOcrDto,
    @RpcFile() file: Express.Multer.File,
  ) {
    return this.ocrService.extractBackImage(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }
}
