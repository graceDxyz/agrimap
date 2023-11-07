import express from "express";
import {
  createDisbursementHandler,
  deleteDisbursementHandler,
  getAllAssistancesHandler,
  getAllDisbursementHandler,
  getDisbursementHandler,
  updateDisbursementHandler,
} from "../controllers/disbursement.controller";
import requiredUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import {
  createDisbursementSchema,
  getDisbursementSchema,
  updateDisbursementSchema,
} from "../schemas/disbursement.schema";

const router = express.Router();

router.get("/", requiredUser, getAllDisbursementHandler);
router.get("/assistances", requiredUser, getAllAssistancesHandler);
router.get("/:disbursementId", requiredUser, getDisbursementHandler);
router.post(
  "/",
  [requiredUser, validateResource(createDisbursementSchema)],
  createDisbursementHandler,
);
router.put(
  "/:disbursementId",
  [requiredUser, validateResource(updateDisbursementSchema)],
  updateDisbursementHandler,
);
router.delete(
  "/:disbursementId",
  [requiredUser, validateResource(getDisbursementSchema)],
  deleteDisbursementHandler,
);

export default router;
