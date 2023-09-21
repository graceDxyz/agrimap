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
import FarmerModel from "../models/farmer.model";
import {
  createFarmerSchema,
  getFarmerSchema,
  updateFarmerSchema,
} from "../schemas/farmer.schema";

const farmersToSeed = [
  {
    firstname: "John",
    lastname: "Doe",
    address: "123 Main St",
    phoneNumber: "555-1234",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    address: "456 Elm St",
    phoneNumber: "555-5678",
  },
  {
    firstname: "Robert",
    lastname: "Johnson",
    address: "789 Oak St",
    phoneNumber: "555-9012",
  },
  {
    firstname: "Emily",
    lastname: "Wilson",
    address: "101 Pine St",
    phoneNumber: "555-3456",
  },
  {
    firstname: "Michael",
    lastname: "Brown",
    address: "202 Cedar St",
    phoneNumber: "555-7890",
  },
];

function FarmerRoutes(app: Express) {
  app.get("/api/farmers", requiredUser, getAllFarmerHandler);
  app.get("/api/farmers/:farmerId", requiredUser, getFarmerHandler);
  app.post(
    "/api/farmers",
    [requiredUser, validateResource(createFarmerSchema)],
    createFarmerHandler
  );
  app.put(
    "/api/farmers/:farmerId",
    [requiredUser, validateResource(updateFarmerSchema)],
    updateFarmerHandler
  );
  app.delete(
    "/api/farmers/:farmerId",
    [requiredUser, validateResource(getFarmerSchema)],
    deleteFarmerHandler
  );

  FarmerModel.countDocuments().then((res) => {
    if (res <= 0) {
      FarmerModel.insertMany(farmersToSeed);
    }
  });
}

export default FarmerRoutes;
