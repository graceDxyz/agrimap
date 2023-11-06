import { Express } from "express";
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

function DisbursementRoutes(app: Express) {
  app.get("/api/disbursements", requiredUser, getAllDisbursementHandler);
  app.get(
    "/api/disbursements/assistances",
    requiredUser,
    getAllAssistancesHandler
  );
  app.get(
    "/api/disbursements/:disbursementId",
    requiredUser,
    getDisbursementHandler
  );
  app.post(
    "/api/disbursements",
    [requiredUser, validateResource(createDisbursementSchema)],
    createDisbursementHandler
  );
  app.put(
    "/api/disbursements/:disbursementId",
    [requiredUser, validateResource(updateDisbursementSchema)],
    updateDisbursementHandler
  );
  app.delete(
    "/api/disbursements/:disbursementId",
    [requiredUser, validateResource(getDisbursementSchema)],
    deleteDisbursementHandler
  );
}

export default DisbursementRoutes;
