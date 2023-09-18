import * as z from "zod";
import { farmerSchema } from "./farmer";

const coordinatesSchema = z.array(z.array(z.tuple([z.number(), z.number()])));

export const farmSchema = z.object({
  _id: z.string(),
  id: z.string(),
  owner: farmerSchema,
  proof: z.string(),
  hectar: z.number(),
  coordinates: coordinatesSchema,
});

export const farmsSchema = z.object({
  farms: z.array(farmSchema),
});

export const createFarmSchema = z.object({
  ownerId: z.string(),
  proof: z.string(),
  hectar: z.number(),
  coordinates: coordinatesSchema,
});
