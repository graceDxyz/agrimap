import { createUserBody } from "schema";
import * as z from "zod";
import { params } from "./base.schema";

export const Role = z.enum(["USER", "ADMIN"]);

const body = createUserBody;

const createUserSchema = z.object({ body });
const updateUserSchema = z.object({
  body,
  params,
});

const getUserSchema = z.object({ params });

export { createUserSchema, getUserSchema, updateUserSchema };
