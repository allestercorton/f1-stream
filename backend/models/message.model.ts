import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
class Message {
  @prop({ type: String, required: true })
  public userId!: string;

  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String, required: true })
  public content!: string;
}

const MessageModel = getModelForClass(Message);
export default MessageModel;
