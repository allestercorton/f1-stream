import {
  prop,
  getModelForClass,
  modelOptions,
  type Ref,
} from '@typegoose/typegoose';
import { randomBytes } from 'node:crypto';
import { User } from './user.model.js';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    expires: '1h', // Built-in expiration (cleaner than separate field)
  },
})
export class PasswordResetToken {
  @prop({
    ref: () => User,
    required: true,
    index: true,
  })
  public user!: Ref<User>;

  @prop({
    type: String,
    required: true,
    unique: true,
    default: () => randomBytes(32).toString('hex'), // Auto-generate on creation
  })
  public token!: string;

  // Static method kept for cases where you need to generate without saving
  public static generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }
}

const PasswordResetTokenModel = getModelForClass(PasswordResetToken);
export default PasswordResetTokenModel;
