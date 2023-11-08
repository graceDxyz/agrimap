import express, { Router } from "express";
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

const router: Router = express.Router();

router.get("/", requiredUser, getAllFarmHandler);
router.get("/crops", requiredUser, getAllFarmCropsHandler);
router.get(
  "/:id",
  [requiredUser, validateResource(getFarmSchema)],
  getFarmHandler,
);
router.post(
  "/",
  [requiredUser, validateResource(createFarmSchema)],
  createFarmHandler,
);
router.put(
  "/:id",
  [requiredUser, validateResource(updateFarmSchema)],
  updateFarmHandler,
);
router.delete(
  "/:id",
  [requiredUser, validateResource(getFarmSchema)],
  deleteFarmHandler,
);
router.post(
  "/:id/archived",
  [requiredUser, validateResource(getFarmSchema)],
  archivedFarmHandler,
);

export default router;
