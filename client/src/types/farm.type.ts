import { createFarmSchema, farmSchema } from "@/lib/validations/farm";
import * as z from "zod";

export type Farm = z.infer<typeof farmSchema>;
export type CreateFarmInput = z.infer<typeof createFarmSchema>;
