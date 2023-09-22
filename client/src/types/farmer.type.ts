import {
  addressSchema,
  createFarmerSchema,
  farmerSchema,
} from "@/lib/validations/farmer";
import * as z from "zod";

export type Farmer = z.infer<typeof farmerSchema>;
export type CreateFarmerInput = z.infer<typeof createFarmerSchema>;
export type Adsress = z.infer<typeof addressSchema>;
