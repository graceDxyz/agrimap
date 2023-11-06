import * as z from "zod";
import {
  createDisbursementSchema,
  getDisbursementSchema,
  updateDisbursementSchema,
} from "../schemas/disbursement.schema";

export type CreateDisbursementInput = z.TypeOf<typeof createDisbursementSchema>;
export type GetDisbursementInput = z.TypeOf<typeof getDisbursementSchema>;
export type UpdateDisbursementInput = z.TypeOf<typeof updateDisbursementSchema>;
