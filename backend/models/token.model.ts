import { prop, getModelForClass, type Ref } from '@typegoose/typegoose';
import crypto from 'crypto';
import { User } from './user.model';

export class PasswordResetToken {
  @prop({ ref: () => User, required: true, index: true })
  public user!: Ref<User>;

  @prop({ type: String, required: true, unique: true })
  public token!: string;

  @prop({ type: Date, default: Date.now, expires: '1h' })
  public createdAt?: Date;

  // Static method to generate a reset token
  public static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

const PasswordResetTokenModel = getModelForClass(PasswordResetToken, {
  schemaOptions: { timestamps: true },
});

export default PasswordResetTokenModel;
