import { createFarmBody } from "schema";
import * as z from "zod";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

const payload = {
  body: createFarmBody,
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
