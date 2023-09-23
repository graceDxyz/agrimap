import * as z from "zod";
import { farmerSchema } from "./farmer";

export const farmerDataSchema = z.object({
  name: z.string(),
  count: z.number(),
});

export const recentAddedSchema = z.object({
  count: z.number(),
  todayFarmers: z.array(farmerSchema),
});
