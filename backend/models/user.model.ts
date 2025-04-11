import {
  prop,
  getModelForClass,
  pre,
  type DocumentType,
} from '@typegoose/typegoose';
import argon2 from 'argon2';

@pre<User>('save', async function (next) {
  try {
    // Only hash the password if it's modified or a new record
    if (this.isModified('password') || this.isNew) {
      this.password = await argon2.hash(this.password);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
})
export class User {
  @prop({ type: String, required: true })
  public name!: string;

  @prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  })
  public email!: string;

  @prop({ type: String, required: true, minlength: 6 })
  public password!: string;

  // Method to compare passwords
  public async comparePassword(
    this: DocumentType<User>,
    candidatePassword: string
  ): Promise<boolean> {
    return argon2.verify(this.password, candidatePassword);
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

export default UserModel;
