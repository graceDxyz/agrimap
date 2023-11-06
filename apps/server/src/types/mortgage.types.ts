import * as z from "zod";
import {
  createMortgageSchema,
  getMortgageSchema,
  updateMortgageSchema,
} from "../schemas/mortgage.schema";

export type CreateMortgageInput = z.TypeOf<typeof createMortgageSchema>;
export type GetMortgageInput = z.TypeOf<typeof getMortgageSchema>;
export type UpdateMortgageInput = z.TypeOf<typeof updateMortgageSchema>;
