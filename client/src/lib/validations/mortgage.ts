import { format } from "date-fns";
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
    mortgageDate: z.object({
      from: z.string(),
      to: z.string(),
    }),
    status: statusSchema,
    farmTitle: z.string().nullish(),
    farmerName: z.string().nullish(),
    farmSize: z.number().nullish(),
    mortgageToName: z.string().nullish(),
    mortgageDateRange: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    farmTitle: obj.farm.titleNumber,
    farmerName: obj.farm.owner.fullName,
    farmSize: obj.farm.size,
    mortgageToName: obj.mortgageTo.fullName,
    mortgageDateRange: `${format(
      new Date(obj.mortgageDate.from),
      "LLL dd, y"
    )} - ${format(new Date(obj.mortgageDate.to), "LLL dd, y")}`,
  }));

export const mortgagesSchema = z.object({
  mortgages: z.array(mortgageSchema),
});

export const createMortgageSchema = z.object({
  farmId: z.string().min(1, { message: "Please select a title number" }),
  mortgageToId: z.string().min(1, { message: "Please select a farmer" }),
  mortgageAmount: z.number(),
  mortgageDate: z.object({
    from: z.string(),
    to: z.string(),
  }),
  status: statusSchema,
});
