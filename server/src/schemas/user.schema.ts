import * as z from "zod";

export const Role = z.enum(["USER", "ADMIN"]);

const payload = {
  body: z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(100),
    role: Role,
  }),
};

const params = {
  params: z.object({
    userId: z.string({
      required_error: "userId is required",
    }),
  }),
};

const createUserSchema = z.object({ ...payload });
const updateUserSchema = z.object({
  ...payload,
  ...params,
});

const getUserSchema = z.object({ ...params });

export { createUserSchema, getUserSchema, updateUserSchema };
