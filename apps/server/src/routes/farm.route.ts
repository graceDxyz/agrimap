import express from "express";
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

const router = express.Router();

router.get("/", requiredUser, getAllFarmHandler);
router.get("/crops", requiredUser, getAllFarmCropsHandler);
router.get(
  "/:farmId",
  [requiredUser, validateResource(getFarmSchema)],
  getFarmHandler,
);
router.post(
  "/",
  [requiredUser, validateResource(createFarmSchema)],
  createFarmHandler,
);
router.put(
  "/:farmId",
  [requiredUser, validateResource(updateFarmSchema)],
  updateFarmHandler,
);
router.delete(
  "/:farmId",
  [requiredUser, validateResource(getFarmSchema)],
  deleteFarmHandler,
);
router.post(
  "/:farmId/archived",
  [requiredUser, validateResource(getFarmSchema)],
  archivedFarmHandler,
);

export default router;
