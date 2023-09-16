import {
  Role,
  activeUserSchema,
  createUserSchema,
  userSchema,
} from "@/lib/validations/user";
import * as z from "zod";

export type User = z.infer<typeof userSchema>;
export type ActiveUser = z.infer<typeof activeUserSchema>;
export type Role = z.infer<typeof Role>; // Define the FishEnum typ
export type CreateInputs = z.infer<typeof createUserSchema>;
