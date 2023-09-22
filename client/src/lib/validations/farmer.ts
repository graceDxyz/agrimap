import * as z from "zod";

export const addressSchema = z.object({
  streetAddress: z.string(),
  cityOrProvince: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  zipcode: z.string(),
});

export const farmerSchema = z
  .object({
    _id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    address: addressSchema,
    phoneNumber: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    totalSize: z.number().nullish(),
    fullName: z.string().nullish(),
    fullAddress: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    fullName: `${obj.lastname}, ${obj.firstname}`,
    fullAddress: `${obj.address.streetAddress}, ${obj.address.barangay}, ${obj.address.municipality}, ${obj.address.cityOrProvince}, ${obj.address.zipcode}`,
  }));

export const farmersSchema = z.object({
  farmers: z.array(farmerSchema),
});

export const createFarmerSchema = z.object({
  firstname: z.string().nonempty({ message: "Please input a firstname" }),
  lastname: z.string().nonempty({ message: "Please input a lastname" }),
  address: addressSchema,
  phoneNumber: z.string(),
});
