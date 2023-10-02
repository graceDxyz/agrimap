import * as z from "zod";
import { farmSchema } from "./farm";
import { farmerSchema } from "./farmer";

export const statusSchema = z.enum(["Active", "Paid Off", "Defaulted"]);

export const mortgageSchema = z
  .object({
    _id: z.string(),
    farm: farmSchema,
    mortgageTo: farmerSchema,
    mortgageAmount: z.number(),
    startDate: z.string().nullish(),
    endDate: z.string().nullish(),
    status: statusSchema,
    farmTitle: z.string().nullish(),
    farmerName: z.string().nullish(),
    farmSize: z.number().nullish(),
    mortgageToName: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    farmTitle: obj.farm.titleNumber,
    farmerName: obj.farm.owner.fullName,
    farmSize: obj.farm.size,
    mortgageToName: obj.mortgageTo.fullName,
  }));

export const mortgagesSchema = z.object({
  mortgages: z.array(mortgageSchema),
});

export const createMortgageSchema = z.object({
  farmId: z.string().nonempty({ message: "Please select a title number" }),
  mortgageToId: z.string().nonempty({ message: "Please select a farmer" }),
  mortgageAmount: z.number(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  status: statusSchema,
});
