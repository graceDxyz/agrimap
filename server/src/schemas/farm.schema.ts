import * as z from "zod";
import { addressSchema } from "./farmer.schema";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

const payload = {
  body: z.object({
    ownerId: z.string(),
    titleNumber: z.string(),
    proofFiles: z.array(
      z.object({
        fileKey: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
      })
    ),
    size: z.number(),
    coordinates: coordinatesSchema,
    address: addressSchema,
    isArchived: z.boolean(),
  }),
};

const params = {
  params: z.object({
    farmId: z.string({
      required_error: "farmId is required",
    }),
  }),
};

const createFarmSchema = z.object({ ...payload });
const updateFarmSchema = z.object({
  ...payload,
  ...params,
});

const getFarmSchema = z.object({ ...params });

export { createFarmSchema, getFarmSchema, updateFarmSchema };
