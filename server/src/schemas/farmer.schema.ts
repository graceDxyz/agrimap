import * as z from "zod";

const payload = {
  body: z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
  }),
};

const params = {
  params: z.object({
    farmerId: z.string({
      required_error: "farmerId is required",
    }),
  }),
};

const createFarmerSchema = z.object({ ...payload });
const updateFarmerSchema = z.object({
  ...payload,
  ...params,
});

const getFarmerSchema = z.object({ ...params });

export { createFarmerSchema, getFarmerSchema, updateFarmerSchema };
