import { Express } from "express";
import {
  createMortgageHandler,
  deleteMortgageHandler,
  getAllMortgageHandler,
  getMortgageHandler,
  updateMortgageHandler,
} from "../controllers/mortgage.controller";
import requiredUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import {
  createMortgageSchema,
  getMortgageSchema,
  updateMortgageSchema,
} from "../schemas/mortgage.schema";

function MortgageRoutes(app: Express) {
  app.get("/api/mortgages", requiredUser, getAllMortgageHandler);
  app.get("/api/mortgages/:mortgageId", requiredUser, getMortgageHandler);
  app.post(
    "/api/mortgages",
    [requiredUser, validateResource(createMortgageSchema)],
    createMortgageHandler,
  );
  app.put(
    "/api/mortgages/:mortgageId",
    [requiredUser, validateResource(updateMortgageSchema)],
    updateMortgageHandler,
  );
  app.delete(
    "/api/mortgages/:mortgageId",
    [requiredUser, validateResource(getMortgageSchema)],
    deleteMortgageHandler,
  );
}

export default MortgageRoutes;
