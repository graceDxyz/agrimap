import * as z from "zod";

export const roleSchema = z.enum(["USER", "ADMIN"]);

export const userSchema = z.object({
  _id: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string().nullish(),
  role: roleSchema,
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
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100),
  role: roleSchema,
});
