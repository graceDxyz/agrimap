import {
  barangaySchema,
  citySchema,
  phAddressSchema,
  provinceSchema,
} from "@/lib/validations/address";
import * as z from "zod";

export type PhAddress = z.infer<typeof phAddressSchema>;
export type Province = z.infer<typeof provinceSchema>;
export type City = z.infer<typeof citySchema>;
export type Barangay = z.infer<typeof barangaySchema>;
