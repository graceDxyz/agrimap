import * as z from "zod";
import {
  createFarmerSchema,
  getFarmerSchema,
  updateFarmerSchema,
} from "../schemas/farmer.schema";

export type CreateFarmerInput = z.TypeOf<typeof createFarmerSchema>;
export type GetFarmerInput = z.TypeOf<typeof getFarmerSchema>;
export type UpdateFarmerInput = z.TypeOf<typeof updateFarmerSchema>;
