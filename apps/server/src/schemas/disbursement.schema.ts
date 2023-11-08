import { createDisbursementBody } from "schema";
import * as z from "zod";
import { params } from "./base.schema";

const body = createDisbursementBody;

const createDisbursementSchema = z.object({
  body,
});

const updateDisbursementSchema = z.object({
  body,
  params,
});

const getDisbursementSchema = z.object({ params });

export {
  createDisbursementSchema,
  getDisbursementSchema,
  updateDisbursementSchema,
};
