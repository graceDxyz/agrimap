import * as z from "zod";
import { farmSchema } from "./farm";
import { farmerSchema } from "./farmer";

export const statusSchema = z.enum(["Active", "Paid Off", "Defaulted"]);

export const mortgageSchema = z.object({
  _id: z.string(),
  farm: farmSchema,
  mortgageTo: farmerSchema,
  mortgageAmount: z.number(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  status: statusSchema,
});

export const mortgagesSchema = z.object({
  mortgages: z.array(mortgageSchema),
});

export const createMortgageSchema = z.object({
  farmId: z.string(),
  mortgageToId: z.string(),
  mortgageAmount: z.number(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  status: statusSchema,
});
