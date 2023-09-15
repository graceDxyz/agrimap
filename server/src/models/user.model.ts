import mongoose from "mongoose";
// import * as bcrypt from "bcrypt";
// import config from "config";

export interface UserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  userRole: string;
}

export interface IUser extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
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
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

userSchema.pre("save", async function (next) {
  // let user = this as IUser;

  // if (!user.isModified("password")) {
  //   return next();
  // }

  // const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  // const hash = bcrypt.hashSync(user.password, salt);

  // user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as IUser;

  // return bcrypt.compare(candidatePassword, user.password).catch(() => false);

  return user.password === candidatePassword;
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
