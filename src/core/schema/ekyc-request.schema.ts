import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BackImageReponseObject } from 'src/app/ekyc/types/back-image.type';
import { FaceCompareResponseObject } from 'src/app/ekyc/types/face-compare.type';
import { FrontImageReponseObject } from 'src/app/ekyc/types/front-image.type';
import { EkycFile } from './ekyc-file.schema';

export enum EkycStatus {
  initiated = 'initiated',
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class EkycRequest extends Document {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: EkycStatus.initiated, enum: EkycStatus })
  status: EkycStatus;

  @Prop({ required: false })
  reason?: string;

  @Prop({ required: false, ref: EkycFile.name, type: Types.ObjectId })
  frontIdentityCard: string | EkycFile;

  @Prop({ required: false, ref: EkycFile.name, type: Types.ObjectId })
  backIdentityCard: string | EkycFile;

  @Prop({ required: false, ref: EkycFile.name, type: Types.ObjectId })
  face: string | EkycFile;

  @Prop({ required: false, type: String })
  videoSelfieUrl: string | null;

  @Prop({ required: false, type: Types.Map })
  frontIdentityCardOcrResult: FrontImageReponseObject | null;

  @Prop({ required: false, type: Types.Map })
  backIdentityCardOcrResult: BackImageReponseObject | null;

  @Prop({ required: false, type: Types.Map })
  faceComparisonResult: FaceCompareResponseObject | null;

  @Prop({ required: false, type: Types.Map })
  approvedAt: Date | null;
}

export const EkycRequestSchema = SchemaFactory.createForClass(EkycRequest);
