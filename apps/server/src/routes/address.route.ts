import express from "express";
import {
  getAddressHandler,
  getBarangaysHandler,
  getCitiesHandler,
  getCityHandler,
  getProvinceHandler,
  getProvincesHandler,
  seedAddressHandler,
} from "../controllers/address.controller";

const router = express.Router();

router.get("/", getAddressHandler);
router.get("/province", getProvincesHandler);
router.get("/province/:psgcCode", getProvinceHandler);
router.get("/city", getCitiesHandler);
router.get("/city/:psgcCode", getCityHandler);
router.get("/barangay", getBarangaysHandler);
router.get("/seed", seedAddressHandler);

export default router;
