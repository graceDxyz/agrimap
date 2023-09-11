import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  userRole: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: 'USER',
      enum: ['USER', 'ADMIN'],
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  const user = this as unknown as User;

  if (!user.isModified('password')) {
    return next();
  }

  const hash = await bcrypt.hash(user.password, 10);

  user.password = hash;

  return next();
});
