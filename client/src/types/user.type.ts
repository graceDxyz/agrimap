import { activeUserSchema, userSchema } from "@/lib/validations/user";
import * as z from "zod";

export type User = z.infer<typeof userSchema>;
export type ActiveUser = z.infer<typeof activeUserSchema>;
