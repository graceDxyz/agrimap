import * as z from "zod";
import { farmerSchema } from "./farmer";

export const disbursementSchema = z
  .object({
    _id: z.string(),
    farmer: farmerSchema,
    assistanceName: z.array(z.string()),
    receivedDate: z.string(),
    receiverName: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    receiverName: obj.farmer.fullName,
  }));

export const disbursementsSchema = z.object({
  disbursements: z.array(disbursementSchema),
});

export const createDisbursementSchema = z.object({
  farmer: z.string().min(1, { message: "Please select a farmer" }),
  crops: z.array(z.string()).default([]),
  receivedDate: z.string().min(1, { message: "Please select a date" }),
});
