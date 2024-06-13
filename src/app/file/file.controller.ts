import {
  Controller,
  BadRequestException,
  UploadedFile,
  Body,
  Post,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { GetCurrentUserId } from 'src/core/decorators';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(
    @Body() createFileDto: CreateFileDto,
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.fileService.addFile({
      ...createFileDto,
      file,
      userId,
    });
  }
}
