import { Express } from "express";

import {
  getBarangayHandler,
  getCityHandler,
  getProvinceHandler,
} from "../controllers/address.controller";

function AddressRoutes(app: Express) {
  app.get("/api/address/province", getProvinceHandler);
  app.get("/api/address/city", getCityHandler);
  app.get("/api/address/barangay", getBarangayHandler);
}

export default AddressRoutes;
