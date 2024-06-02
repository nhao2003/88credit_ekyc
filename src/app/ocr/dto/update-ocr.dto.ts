import { PartialType } from '@nestjs/swagger';
import { ImageOcrDto } from './create-ocr.dto';

export class UpdateOcrDto extends PartialType(ImageOcrDto) {}
