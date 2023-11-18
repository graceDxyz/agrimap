import * as z from "zod";
import { addressSchema, farmerSchema } from "./farmer";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

export const fileSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
});

export const farmMortgageSchema = z.object({
  _id: z.string(),
  mortgageTo: farmerSchema,
  mortgageAmount: z.number(),
  mortgageDate: z.object({
    from: z.string(),
    to: z.string(),
  }),
  status: z.string(),
  size: z.number(),
  coordinates: coordinatesSchema,
  proofFiles: z.array(fileSchema),
});

export const farmSchema = z
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
    mortgages: z.array(farmMortgageSchema),
  })
  .transform((obj) => ({
    ...obj,
    ownerName: `${obj.owner.lastname}, ${obj.owner.firstname} ${obj.owner.middleInitial}.`,
  }));

export const farmsSchema = z.object({
  farms: z.array(farmSchema),
});

export const createFarmBody = z.object({
  ownerId: z.string().min(1, { message: "Please select a farmer" }),
  titleNumber: z
    .string()
    .min(1, { message: "Please input a title number" })
    .min(6, { message: "Title number must containt atleast 6 characters" }),
  proofFiles: z.array(fileSchema),
  size: z.coerce
    .number()
    .nonnegative({ message: "Size must be greater than or equal to 0" }),
  coordinates: coordinatesSchema.min(1, {
    message: "Please select map coordinates on the map",
  }),
  address: addressSchema,
  isArchived: z.boolean().default(false),
  crops: z.array(z.string()).default([]),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Farm = z.infer<typeof farmSchema>;
export type FarmMortgage = z.infer<typeof farmMortgageSchema>;
export type Farms = z.infer<typeof farmsSchema>;
export type CreateFarmInput = z.infer<typeof createFarmBody>;
