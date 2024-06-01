import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaceService } from './face.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { UpdateFaceDto } from './dto/update-face.dto';

@Controller('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post()
  create(@Body() createFaceDto: CreateFaceDto) {
    return this.faceService.create(createFaceDto);
  }

  @Get()
  findAll() {
    return this.faceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaceDto: UpdateFaceDto) {
    return this.faceService.update(+id, updateFaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faceService.remove(+id);
  }
}
