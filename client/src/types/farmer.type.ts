import { farmerSchema } from "@/lib/validations/farmer";
import * as z from "zod";

export type Farmer = z.infer<typeof farmerSchema>;
