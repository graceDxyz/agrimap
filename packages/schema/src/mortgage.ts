import { format } from "date-fns";
import * as z from "zod";
import { coordinatesSchema, fileSchema } from "./farm";
import { addressSchema, farmerSchema } from "./farmer";

export const statusSchema = z.enum(["Active", "Paid Off", "Defaulted"]);

export const mortgageFarmSchema = z
  .object({
    _id: z.string(),
    owner: farmerSchema,
    titleNumber: z.string(),
    proofFiles: z.array(fileSchema),
    size: z.number(),
    isMortgage: z.boolean().nullish(),
    coordinates: coordinatesSchema,
    address: addressSchema,
    ownerName: z.string().nullish(),
    isArchived: z.boolean(),
    crops: z.array(z.string()),
  })
  .transform((obj) => ({
    ...obj,
    ownerName: `${obj.owner.lastname}, ${obj.owner.firstname} ${obj.owner.middleInitial}.`,
  }));

export const mortgageSchema = z
  .object({
    _id: z.string(),
    farm: mortgageFarmSchema,
    mortgageTo: farmerSchema,
    mortgageAmount: z.number(),
    mortgageDate: z.object({
      from: z.string(),
      to: z.string(),
    }),
    status: statusSchema,
    size: z.number(),
    coordinates: coordinatesSchema,
    proofFiles: z.array(fileSchema),
    farmTitle: z.string().nullish(),
    farmerName: z.string().nullish(),
    mortgageToName: z.string().nullish(),
    mortgageDateRange: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    farmTitle: obj.farm.titleNumber,
    farmerName: obj.farm.owner.fullName,
    mortgageToName: obj.mortgageTo.fullName,
    mortgageDateRange: `${format(
      new Date(obj.mortgageDate.from),
      "LLL dd, y"
    )} - ${format(new Date(obj.mortgageDate.to), "LLL dd, y")}`,
  }));

export const mortgagesSchema = z.object({
  mortgages: z.array(mortgageSchema),
});

export const createMortgageBody = z.object({
  farmId: z.string().min(1, { message: "Please select a title number" }),
  mortgageToId: z.string().min(1, { message: "Please select a farmer" }),
  mortgageAmount: z.number(),
  mortgageDate: z.object({
    from: z.string(),
    to: z.string(),
  }),
  status: statusSchema,
  size: z.coerce
    .number()
    .nonnegative({ message: "Size must be greater than or equal to 0" }),
  coordinates: coordinatesSchema.min(1, {
    message: "Please select map coordinates on the map",
  }),
  proofFiles: z.array(fileSchema),
});

export type Status = z.infer<typeof statusSchema>;
export type Mortgage = z.infer<typeof mortgageSchema>;
export type Mortgages = z.infer<typeof mortgagesSchema>;
export type CreateMortgageInput = z.infer<typeof createMortgageBody>;
