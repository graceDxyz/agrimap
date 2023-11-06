import { createMortgageBody } from "schema";
import * as z from "zod";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

const payload = {
  body: createMortgageBody,
};

const params = {
  params: z.object({
    mortgageId: z.string({
      required_error: "mortgageId is required",
    }),
  }),
};

const createMortgageSchema = z.object({ ...payload });
const updateMortgageSchema = z.object({
  ...payload,
  ...params,
});

const getMortgageSchema = z.object({ ...params });

export { createMortgageSchema, getMortgageSchema, updateMortgageSchema };
