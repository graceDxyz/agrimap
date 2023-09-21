import * as z from "zod";

export const farmerSchema = z.object({
  _id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  totalSize: z.number().nullish(),
});

export const farmersSchema = z.object({
  farmers: z.array(farmerSchema),
});

export const createFarmerSchema = z.object({
  firstname: z.string().nonempty({ message: "Please input a firstname" }),
  lastname: z.string().nonempty({ message: "Please input a lastname" }),
  address: z.string(),
  phoneNumber: z.string(),
});
