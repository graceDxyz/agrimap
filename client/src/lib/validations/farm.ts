import * as z from "zod";
import { farmerSchema } from "./farmer";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

export const fileSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
});

export const farmSchema = z.object({
  _id: z.string(),
  owner: farmerSchema,
  title: z.array(fileSchema),
  hectar: z.number(),
  coordinates: coordinatesSchema,
});

export const farmsSchema = z.object({
  farms: z.array(farmSchema),
});

export const createFarmSchema = z.object({
  ownerId: z.string().nonempty({ message: "Please select a farmer" }),
  title: z.array(fileSchema),
  hectar: z.coerce.number(),
  coordinates: coordinatesSchema,
});
