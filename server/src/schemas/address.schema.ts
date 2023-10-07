import * as z from "zod";

const params = {
  params: z.object({
    psgcCode: z.string({
      required_error: "psgcCode is required",
    }),
  }),
};

const getAddressSchema = z.object({ ...params });

export { getAddressSchema };
