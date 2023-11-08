import { createFarmerBody } from "schema";
import * as z from "zod";
import { params } from "./base.schema";

export const addressSchema = z.object({
  streetAddress: z.string(),
  cityOrProvince: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  zipcode: z.string(),
});

const body = createFarmerBody;
const createFarmerSchema = z.object({ body });
const updateFarmerSchema = z.object({
  body,
  params,
});

const getFarmerSchema = z.object({ params });

export { createFarmerSchema, getFarmerSchema, updateFarmerSchema };
