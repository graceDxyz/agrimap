import * as z from "zod";
import {
  createFarmSchema,
  getFarmSchema,
  updateFarmSchema,
} from "../schemas/farm.schema";

export type CreateFarmInput = z.TypeOf<typeof createFarmSchema>;
export type GetFarmInput = z.TypeOf<typeof getFarmSchema>;
export type UpdateFarmInput = z.TypeOf<typeof updateFarmSchema>;
