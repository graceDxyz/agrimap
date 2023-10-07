import * as z from "zod";

export const provinceSchema = z.object({
  psgcCode: z.string(),
  name: z.string(),
  label: z.string(),
  value: z.string(),
});

export const citySchema = z.object({
  psgcCode: z.string(),
  name: z.string(),
  provinceCode: z.string(),
  label: z.string(),
  value: z.string(),
});

export const barangaySchema = z.object({
  psgcCode: z.string(),
  name: z.string(),
  provinceCode: z.string(),
  cityMunCode: z.string(),
  label: z.string(),
  value: z.string(),
});

export const phAddressSchema = z.object({
  provinces: z.array(provinceSchema),
  cities: z.array(citySchema),
  barangays: z.array(barangaySchema),
});
