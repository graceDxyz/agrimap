import { Express } from "express";
import {
  archivedFarmHandler,
  createFarmHandler,
  deleteFarmHandler,
  getAllFarmCropsHandler,
  getAllFarmHandler,
  getFarmHandler,
  updateFarmHandler,
} from "../controllers/farm.controller";
import requiredUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import {
  createFarmSchema,
  getFarmSchema,
  updateFarmSchema,
} from "../schemas/farm.schema";

function FarmRoutes(app: Express) {
  app.get("/api/farms", requiredUser, getAllFarmHandler);
  app.get("/api/farms/crops", requiredUser, getAllFarmCropsHandler);
  app.get("/api/farms/:farmId", requiredUser, getFarmHandler);
  app.post(
    "/api/farms",
    [requiredUser, validateResource(createFarmSchema)],
    createFarmHandler
  );
  app.put(
    "/api/farms/:farmId",
    [requiredUser, validateResource(updateFarmSchema)],
    updateFarmHandler
  );
  app.delete(
    "/api/farms/:farmId",
    [requiredUser, validateResource(getFarmSchema)],
    deleteFarmHandler
  );
  app.post(
    "/api/farms/:farmId/archived",
    [requiredUser, validateResource(getFarmSchema)],
    archivedFarmHandler
  );
}

export default FarmRoutes;
