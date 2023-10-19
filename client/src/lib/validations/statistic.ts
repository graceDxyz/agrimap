import * as z from "zod";
import { farmerSchema } from "./farmer";

export const farmerDataSchema = z.object({
  _id: z.string(),
  count: z.number(),
});

export const recentAddedSchema = z.object({
  count: z.number(),
  todayFarmers: z.array(farmerSchema),
});

export const statCountSchema = z.object({
  totalFarmers: z.number(),
  totalFarmSize: z.number(),
  totalMortgageSize: z.number(),
});
