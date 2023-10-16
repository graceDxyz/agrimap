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
    middleInitial: "D",
    address: {
      streetAddress: "123 Main St",
      cityOrProvince: "Davao City",
      municipality: "Davao del Sur",
      barangay: "Buhangin",
      zipcode: "8000",
    },
    phoneNumber: "555-1234",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    middleInitial: "D",
    address: {
      streetAddress: "456 Elm St",
      cityOrProvince: "Cagayan de Oro City",
      municipality: "Misamis Oriental",
      barangay: "Carmen",
      zipcode: "9000",
    },
    phoneNumber: "555-5678",
  },
  {
    firstname: "Robert",
    lastname: "Johnson",
    middleInitial: "D",
    address: {
      streetAddress: "789 Oak St",
      cityOrProvince: "Zamboanga City",
      municipality: "Zamboanga del Sur",
      barangay: "Tetuan",
      zipcode: "7000",
    },
    phoneNumber: "555-9012",
  },
  {
    firstname: "Emily",
    lastname: "Wilson",
    middleInitial: "D",
    address: {
      streetAddress: "101 Pine St",
      cityOrProvince: "General Santos City",
      municipality: "South Cotabato",
      barangay: "Calumpang",
      zipcode: "9500",
    },
    phoneNumber: "555-3456",
  },
  {
    firstname: "Michael",
    lastname: "Brown",
    middleInitial: "D",
    address: {
      streetAddress: "202 Cedar St",
      cityOrProvince: "Butuan City",
      municipality: "Agusan del Norte",
      barangay: "Baan",
      zipcode: "8600",
    },
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
