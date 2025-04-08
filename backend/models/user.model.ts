import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

@modelOptions({ schemaOptions: { timestamps: true } })
class User {
  _id!: Types.ObjectId;

  @prop({ type: String, required: true, unique: true })
  public googleId!: string;

  @prop({ type: String, required: true, unique: true })
  public email!: string;

  @prop({ type: String, required: true })
  public displayName!: string;

  @prop({ type: String, required: true })
  public firstName!: string;

  @prop({ type: String })
  public lastName?: string;

  @prop({ type: String })
  public profilePicture?: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
