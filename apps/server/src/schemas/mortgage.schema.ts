import { createMortgageBody } from "schema";
import * as z from "zod";
import { params } from "./base.schema";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()])),
);

const body = createMortgageBody;

const createMortgageSchema = z.object({ body });
const updateMortgageSchema = z.object({
  body,
  params,
});

const getMortgageSchema = z.object({ params });

export { createMortgageSchema, getMortgageSchema, updateMortgageSchema };
