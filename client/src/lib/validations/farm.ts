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
  })
  .transform((obj) => ({
    ...obj,
    ownerName: `${obj.owner.lastname}, ${obj.owner.firstname}`,
  }));

export const farmsSchema = z.object({
  farms: z.array(farmSchema),
});

export const createFarmSchema = z.object({
  ownerId: z.string().nonempty({ message: "Please select a farmer" }),
  titleNumber: z
    .string()
    .nonempty({ message: "Please input a title number" })
    .min(6, { message: "Title number must containt atleast 6 characters" }),
  proofFiles: z.array(fileSchema),
  size: z.coerce
    .number()
    .nonnegative({ message: "Hectars must be greater than or equal to 0" }),
  coordinates: coordinatesSchema.min(1, {
    message: "Please select map coordinates on the map",
  }),
  address: addressSchema,
});
