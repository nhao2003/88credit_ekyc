import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Types } from 'mongoose';
import { Participant } from './participant.schema';

@Schema({
  id: true,
  timestamps: true,
  versionKey: false,
})
export class Conversation {
  _id: string;

  @Prop({
    type: Message,
    default: null,
  })
  lastMessage?: Message;

  @Prop({
    type: [Participant],
    required: true,
  })
  participants: Participant[];

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
