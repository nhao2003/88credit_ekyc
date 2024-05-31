import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { Types } from 'mongoose';

@Schema({
  id: false,
  timestamps: true,
  versionKey: false,
})
export class Participant {
  @Prop({
    validate: {
      validator: (v) => {
        return isUUID(v);
      },
      message: (props: any) => `${props.value} is not a valid UUID!`,
    },
    type: Types.UUID,
    required: true,
  })
  _id: string;

  @Prop({
    type: Date,
    default: null,
  })
  lastSeenAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
