import { EkycFileType } from 'src/app/ekyc/enum/enum';

export class CreateFileDto {
  file: Express.Multer.File;
  userId: string;
  type: EkycFileType;
  title: string;
  description: string;
}
