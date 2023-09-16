import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  _id: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string().nullish(),
  role: z.string(),
  createAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export const activeUserSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export const usersSchema = z.object({
  users: z.array(userSchema),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  role: z.string(),
});
