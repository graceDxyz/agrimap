import { format } from "date-fns";
import * as z from "zod";
import { farmerSchema } from "./farmer";

export const disbursementSchema = z
  .object({
    _id: z.string(),
    farmer: farmerSchema,
    size: z.number(),
    assistances: z.array(z.string()),
    receivedDate: z.string(),
    receiverName: z.string().nullish(),
    receivedDateFormat: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    receiverName: obj.farmer.fullName,
    receivedDateFormat: format(new Date(obj.receivedDate), "LLL dd, y"),
  }));

export const disbursementsSchema = z.object({
  disbursements: z.array(disbursementSchema),
});

export const createDisbursementBody = z.object({
  farmer: z.string().min(1, { message: "Please select a farmer" }),
  size: z.coerce
    .number()
    .nonnegative({ message: "Size must be greater than or equal to 0" }),
  assistances: z.array(z.string()).default([]),
  receivedDate: z.string().min(1, { message: "Please select a date" }),
});

export type Disbursement = z.infer<typeof disbursementSchema>;
export type Disbursements = z.infer<typeof disbursementsSchema>;
export type CreateDisbursementInput = z.infer<typeof createDisbursementBody>;
