import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { HttpService } from '@nestjs/axios';
import { EkycService } from '../ekyc/ekyc.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EkycFile } from 'src/core/schema/ekyc-file.schema';
import { catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { FileResponse } from '../ekyc/types/file.type';

@Injectable()
export class FileService {
  constructor(
    private readonly ekycService: EkycService,
    @InjectModel(EkycFile.name) private readonly ekycFileModel: Model<EkycFile>,
    private httpService: HttpService,
  ) {}

  private async uploadToEkycServer(
    file: Express.Multer.File,
    title: string,
    description: string,
  ): Promise<FileResponse> {
    const final = await this.ekycService.addFile({
      file,
      title,
      description,
    });
    return final;
  }

  private async uploadToServerStorage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const formData = new FormData();
    formData.append('file', new Blob([file.buffer]), file.originalname);
    formData.append('folder', folder);
    const endPoint = '/media';
    const response = await firstValueFrom(
      this.httpService
        .post(endPoint, formData, {
          baseURL: 'http://localhost:4000',
        })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            throw error;
          }),
        ),
    );
    return response.data;
  }

  async addFile(createFileDto: CreateFileDto) {
    const res = await Promise.all([
      this.uploadToServerStorage(
        createFileDto.file,
        'ekyc/' + createFileDto.userId,
      ),
      this.uploadToEkycServer(
        createFileDto.file,
        createFileDto.title,
        createFileDto.description,
      ),
    ]);
    const url = res[0];
    const ekycReponse = res[1];
    const file = await this.ekycFileModel.create({
      userId: createFileDto.userId,
      ekycFileType: createFileDto.type,
      url,
      ...ekycReponse.object,
    });
    return file;
  }

  async addVideo(createFileDto: CreateFileDto) {
    const res = await this.uploadToServerStorage(
      createFileDto.file,
      'ekyc/' + createFileDto.userId,
    );
    return res;
  }

  findOne(id: string) {
    return this.ekycFileModel.findById(id);
  }
}
