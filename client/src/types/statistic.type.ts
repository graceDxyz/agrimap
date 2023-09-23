import {
  farmerDataSchema,
  recentAddedSchema,
} from "@/lib/validations/statistic";
import * as z from "zod";

export type RecentAdded = z.infer<typeof recentAddedSchema>;
export type FarmerData = z.infer<typeof farmerDataSchema>;
