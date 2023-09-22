import { recentAddedSchema } from "@/lib/validations/statistic";
import * as z from "zod";

export type RecentAdded = z.infer<typeof recentAddedSchema>;
