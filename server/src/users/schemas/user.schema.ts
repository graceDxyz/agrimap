import * as mongoose from 'mongoose';

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
    username: {
      type: String,
      required: true,
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
