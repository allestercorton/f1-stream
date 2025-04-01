import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'messages',
  },
})
export class Message {
  @prop({ type: Types.ObjectId, ref: 'User', required: true })
  public user!: Types.ObjectId;

  @prop({ type: String, required: true, trim: true, maxlength: 500 })
  public content!: string;

  public createdAt!: Date;
  public updatedAt!: Date;
}

export type MessageDocument = DocumentType<Message>;
export const MessageModel = getModelForClass(Message);
