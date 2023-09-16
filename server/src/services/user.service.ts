import UserModel, { IUser, UserInput } from "../models/user.model";
// import { omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

export async function getAllUser() {
  return UserModel.find().sort({ firstname: 1 }); //.select("-password");
}

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);

    // return omit(user.toJSON(), "password");
    return user.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  // return omit(user.toJSON(), "password");
  return user.toJSON();
}

export async function findUser(query: FilterQuery<IUser>) {
  return UserModel.findOne(query).lean();
}

export async function updateUser(
  query: FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options: QueryOptions
) {
  return UserModel.findByIdAndUpdate(query, update, options);
}

export async function deleteUser(query: FilterQuery<IUser>) {
  return UserModel.deleteOne(query);
}
