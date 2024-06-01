import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export enum EkycFileType {
  face,
  frontIdentityCard,
  backIdentityCard,
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class EkycFile extends Document {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: EkycFileType })
  fileType: EkycFileType;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  tokenId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  storageType: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Date })
  uploadedDate: Date;

  @Prop({ required: true })
  hash: string;
}

export const EkycFileSchema = SchemaFactory.createForClass(EkycFile);

EkycFileSchema.index({ userId: 1 });
