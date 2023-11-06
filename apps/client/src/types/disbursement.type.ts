import {
  createDisbursementSchema,
  disbursementSchema,
} from "@/lib/validations/disbursement";
import * as z from "zod";

export type Disbursement = z.infer<typeof disbursementSchema>;
export type CreateDisbursementInput = z.infer<typeof createDisbursementSchema>;
