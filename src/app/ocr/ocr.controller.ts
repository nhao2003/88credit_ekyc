import {
  Controller,
  Post,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { ImageOcrDto } from './dto/create-ocr.dto';
import { GetCurrentUserId } from 'src/core/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('front-image/:requestId')
  @UseInterceptors(FileInterceptor('file'))
  extractFrontImage(
    @GetCurrentUserId() userId: string,
    @Param('requestId') requestId: string,
    @Body() body: ImageOcrDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ocrService.extractFrontImage(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }

  @Post('back-image/:requestId')
  @UseInterceptors(FileInterceptor('file'))
  extractBackImage(
    @GetCurrentUserId() userId: string,
    @Param('requestId') requestId: string,
    @Body() body: ImageOcrDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ocrService.extractBackImage(userId, requestId, {
      title: body.title,
      description: body.description,
      file: file,
    });
  }
}
