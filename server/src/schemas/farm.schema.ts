import * as z from "zod";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

const payload = {
  body: z.object({
    ownerId: z.string(),
    title: z.array(
      z.object({
        fileKey: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
      })
    ),
    hectar: z.number(),
    coordinates: coordinatesSchema,
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
