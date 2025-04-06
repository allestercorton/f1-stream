import {
  prop,
  getModelForClass,
  modelOptions,
  type Ref,
} from '@typegoose/typegoose';
import type { Types } from 'mongoose';
import { User } from './user.model.js';

export enum ReactionType {
  LIKE = '👍',
  LOVE = '❤️',
  LAUGH = '😂',
  WOW = '😮',
  SAD = '😢',
  ANGRY = '😡',
}

export class Reply {
  _id?: Types.ObjectId;

  @prop({ type: String, required: true })
  public messageId!: string;

  @prop({ type: String, required: true })
  public text!: string;

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: Date })
  public editedAt?: Date;

  @prop({ type: Boolean, default: false })
  public isDeleted?: boolean;

  @prop({ type: String })
  public originalText?: string;
}

export class Reaction {
  @prop({ type: String, enum: ReactionType, required: true })
  public type!: ReactionType;

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Message {
  _id!: Types.ObjectId;

  @prop({ type: String, required: true })
  public text!: string;

  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  // Fix: Define replies as an array type
  @prop({ type: () => [Reply], default: [] })
  public replies?: Reply[];

  // Fix: Define reactions as an array type
  @prop({ type: () => [Reaction], default: [] })
  public reactions?: Reaction[];

  @prop({ ref: 'Message' })
  public replyTo?: Ref<Message>;

  @prop({ type: Date })
  public editedAt?: Date;

  @prop({ type: Boolean, default: false })
  public isDeleted?: boolean;

  @prop({ type: String })
  public originalText?: string;
}

const MessageModel = getModelForClass(Message);
export default MessageModel;
