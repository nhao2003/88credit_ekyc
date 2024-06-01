import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { BackImageReponseObject } from 'src/app/ekyc/types/back-image.type';
import { FaceCompareResponseObject } from 'src/app/ekyc/types/face-compare.type';
import { FrontImageReponseObject } from 'src/app/ekyc/types/front-image.type';
import { EkycFile } from './ekyc-file.schema';

export enum EkycStatus {
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

  @Prop({ required: true })
  status: EkycStatus;

  @Prop({ required: false })
  reason?: string;

  @Prop({ required: true, type: EkycFile })
  frontIdentityCard: string;

  @Prop({ required: true, type: EkycFile })
  backIdentityCard: string;

  @Prop({ required: true })
  face: string;

  @Prop({ required: false })
  frontIdentityCardOcrResult: FrontImageReponseObject;

  @Prop({ required: false })
  backIdentityCardOcrResult: BackImageReponseObject;

  @Prop({ required: false })
  faceComparisonResult: FaceCompareResponseObject;

  @Prop({ required: false })
  approvedAt?: Date;
}

export const EkycRequestSchema = SchemaFactory.createForClass(EkycRequest);
