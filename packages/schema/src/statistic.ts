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
