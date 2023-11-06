import { authBody } from "schema";
import { object } from "zod";

export const createSessionSchema = object({
  body: authBody,
});
