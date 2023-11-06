import { createUserBody } from "schema";
import * as z from "zod";

export const Role = z.enum(["USER", "ADMIN"]);

const payload = {
  body: createUserBody,
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
