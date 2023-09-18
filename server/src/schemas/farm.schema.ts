import * as z from "zod";

const payload = {
  body: z.object({
    ownerId: z.string(),
    proof: z.string(),
    hectar: z.number(),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
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