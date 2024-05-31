import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { HttpService } from '@nestjs/axios';
import { EkycService } from '../ekyc/ekyc.service';

@Injectable()
export class FileService {
  constructor(private readonly ekycService: EkycService) {}

  uploadToEkycServer(
    file: Express.Multer.File,
    title: string,
    description: string,
  ) {
    return this.ekycService.addFile({ file, title, description });
  }
}
