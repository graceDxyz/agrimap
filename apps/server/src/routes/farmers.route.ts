import express, { Router } from "express";
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

const router: Router = express.Router();

router.get("/", requiredUser, getAllFarmerHandler);
router.get("/:id", requiredUser, getFarmerHandler);
router.post(
  "/",
  [requiredUser, validateResource(createFarmerSchema)],
  createFarmerHandler,
);
router.put(
  "/:id",
  [requiredUser, validateResource(updateFarmerSchema)],
  updateFarmerHandler,
);
router.delete(
  "/:id",
  [requiredUser, validateResource(getFarmerSchema)],
  deleteFarmerHandler,
);

export default router;
