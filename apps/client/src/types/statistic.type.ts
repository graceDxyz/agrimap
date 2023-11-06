import {
  farmerDataSchema,
  recentAddedSchema,
  statCountSchema,
} from "@/lib/validations/statistic";
import * as z from "zod";

export enum StatsBy {
  Annually = "Annually",
  Monthly = "Monthly",
  Weekly = "Weekly",
}

export type RecentAdded = z.infer<typeof recentAddedSchema>;
export type FarmerData = z.infer<typeof farmerDataSchema>;
export type StatCount = z.infer<typeof statCountSchema>;

export type StatsQuery = {
  by?: StatsBy;
  year?: number;
  month?: number;
  week?: number;
};

export type SwitcherType = {
  label: string;
  value: StatsBy;
};
