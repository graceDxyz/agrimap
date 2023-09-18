import { Express } from "express";
import {
  createFarmHandler,
  deleteFarmHandler,
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
  app.get("/api/farms/:farmId", requiredUser, getFarmHandler);
  app.post(
    "/api/farms",
    [requiredUser, validateResource(createFarmSchema)],
    createFarmHandler,
  );
  app.put(
    "/api/farms/:farmId",
    [requiredUser, validateResource(updateFarmSchema)],
    updateFarmHandler,
  );
  app.delete(
    "/api/farms/:farmId",
    [requiredUser, validateResource(getFarmSchema)],
    deleteFarmHandler,
  );
}

export default FarmRoutes;
