import * as z from "zod";

const payload = {
  body: z.object({
    farmer: z.string(),
    assistanceName: z.array(z.string()),
    receivedDate: z.string(),
  }),
};

const params = {
  params: z.object({
    disbursementId: z.string({
      required_error: "disbursementId is required",
    }),
  }),
};

const createDisbursementSchema = z.object({ ...payload });
const updateDisbursementSchema = z.object({
  ...payload,
  ...params,
});

const getDisbursementSchema = z.object({ ...params });

export {
  createDisbursementSchema,
  getDisbursementSchema,
  updateDisbursementSchema,
};
