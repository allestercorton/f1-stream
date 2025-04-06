import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
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
  public profilePicture!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
