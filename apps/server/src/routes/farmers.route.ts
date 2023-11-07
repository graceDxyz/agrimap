import express from "express";
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

const router = express.Router();

router.get("/", requiredUser, getAllFarmerHandler);
router.get("/:farmerId", requiredUser, getFarmerHandler);
router.post(
  "/",
  [requiredUser, validateResource(createFarmerSchema)],
  createFarmerHandler,
);
router.put(
  "/:farmerId",
  [requiredUser, validateResource(updateFarmerSchema)],
  updateFarmerHandler,
);
router.delete(
  "/:farmerId",
  [requiredUser, validateResource(getFarmerSchema)],
  deleteFarmerHandler,
);

export default router;
