import { Express } from "express";
import {
  createFarmerHandler,
  deleteFarmerHandler,
  getAllFarmerHandler,
  getFarmerHandler,
  updateFarmerHandler,
} from "../controllers/farmer.controller";
import requiredUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import {
  createFarmerSchema,
  getFarmerSchema,
  updateFarmerSchema,
} from "../schemas/farmer.schema";

function FarmerRoutes(app: Express) {
  app.get("/api/farmers", requiredUser, getAllFarmerHandler);
  app.get("/api/farmers/:farmerId", requiredUser, getFarmerHandler);
  app.post(
    "/api/farmers",
    [requiredUser, validateResource(createFarmerSchema)],
    createFarmerHandler,
  );
  app.put(
    "/api/farmers/:farmerId",
    [requiredUser, validateResource(updateFarmerSchema)],
    updateFarmerHandler,
  );
  app.delete(
    "/api/farmers/:farmerId",
    [requiredUser, validateResource(getFarmerSchema)],
    deleteFarmerHandler,
  );
}

export default FarmerRoutes;
