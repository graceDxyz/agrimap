import express, { Router } from "express";
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

const router: Router = express.Router();

router.get("/", requiredUser, getAllDisbursementHandler);
router.get("/assistances", requiredUser, getAllAssistancesHandler);
router.get(
  "/:id",
  [requiredUser, validateResource(getDisbursementSchema)],
  getDisbursementHandler
);
router.post(
  "/",
  [requiredUser, validateResource(createDisbursementSchema)],
  createDisbursementHandler
);
router.put(
  "/:id",
  [requiredUser, validateResource(updateDisbursementSchema)],
  updateDisbursementHandler
);
router.delete(
  "/:id",
  [requiredUser, validateResource(getDisbursementSchema)],
  deleteDisbursementHandler
);

export default router;
