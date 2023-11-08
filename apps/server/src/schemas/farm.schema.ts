import { createFarmBody } from "schema";
import * as z from "zod";
import { params } from "./base.schema";

export const coordinatesSchema = z.array(
  z.array(z.tuple([z.number(), z.number()]))
);

const body = createFarmBody;

const createFarmSchema = z.object({ body });
const updateFarmSchema = z.object({
  body,
  params,
});

const getFarmSchema = z.object({ params });

export { createFarmSchema, getFarmSchema, updateFarmSchema };
