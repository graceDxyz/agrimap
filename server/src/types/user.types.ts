import * as z from "zod";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type GetUserInput = z.TypeOf<typeof getUserSchema>;
export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
