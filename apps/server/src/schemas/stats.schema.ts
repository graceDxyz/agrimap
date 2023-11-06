import * as z from "zod";

const params = {
  params: z.object({
    farmId: z.string({
      required_error: "farmId is required",
    }),
  }),
};

const getFarmSchema = z.object({ ...params });

export { getFarmSchema };
