import * as z from "zod";
import { farmerSchema } from "./farmer";

export const recentAddedSchema = z.object({
  count: z.number(),
  todayFarmers: z.array(farmerSchema),
});
