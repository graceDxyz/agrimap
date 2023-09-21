import {
  createMortgageSchema,
  mortgageSchema,
  statusSchema,
} from "@/lib/validations/mortgage";
import * as z from "zod";

export type Mortgage = z.infer<typeof mortgageSchema>;
export type CreateMortgageInput = z.infer<typeof createMortgageSchema>;
export type Status = z.infer<typeof statusSchema>;
