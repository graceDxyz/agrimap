import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  _id: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  userRole: z.string(),
});

export const activeUserSchema = z.object({
  user: userSchema,
  mapBoxKey: z.string(),
  accessToken: z.string(),
});

export const usersSchema = z.object({
  users: z.array(userSchema),
});
