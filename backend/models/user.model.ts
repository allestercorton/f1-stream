import {
  getModelForClass,
  prop,
  pre,
  DocumentType,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

@pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})
class User {
  @prop({ type: String, required: true, trim: true })
  public name!: string;

  @prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  public email!: string;

  @prop({ type: String, required: true, minlength: 6 })
  public password!: string;

  public isPasswordMatch(
    this: DocumentType<User>,
    enteredPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

export default UserModel;
