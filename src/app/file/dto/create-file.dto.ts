export class CreateFileDto {
  file: Express.Multer.File;
  title: string;
  description: string;
}
