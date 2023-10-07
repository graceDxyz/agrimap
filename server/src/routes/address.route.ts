import { Express } from "express";

import {
  getAddressHandler,
  getBarangaysHandler,
  getCitiesHandler,
  getCityHandler,
  getProvinceHandler,
  getProvincesHandler,
} from "../controllers/address.controller";

function AddressRoutes(app: Express) {
  app.get("/api/address", getAddressHandler);
  app.get("/api/address/province", getProvincesHandler);
  app.get("/api/address/province/:psgcCode", getProvinceHandler);
  app.get("/api/address/city", getCitiesHandler);
  app.get("/api/address/city/:psgcCode", getCityHandler);
  app.get("/api/address/barangay", getBarangaysHandler);
}

export default AddressRoutes;
