import { Request, Response } from "express";
import {
  createFarm,
  deleteFarm,
  findFarm,
  getAllFarm,
  updateFarm,
} from "../services/farm.service";
import {
  CreateFarmInput,
  GetFarmInput,
  UpdateFarmInput,
} from "../types/farm.types";
import logger from "../utils/logger";

const getAllFarmHandler = async (req: Request, res: Response) => {
  const farms = await getAllFarm();
  return res.send(farms);
};

const getFarmHandler = async (
  req: Request<GetFarmInput["params"]>,
  res: Response,
) => {
  const farmId = req.params.farmId;

  const farm = await findFarm({ _id: farmId });

  if (!farm) {
    return res.sendStatus(404);
  }

  return res.send(farm);
};

const createFarmHandler = async (
  req: Request<{}, {}, CreateFarmInput["body"]>,
  res: Response,
) => {
  try {
    const body = req.body;

    const farm = await createFarm({
      ...body,
      owner: body.ownerId,
    });

    return res.send(farm);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const updateFarmHandler = async (
  req: Request<UpdateFarmInput["params"]>,
  res: Response,
) => {
  const farmId = req.params.farmId;
  const update = req.body;

  const farm = await findFarm({ _id: farmId });

  if (!farm) {
    return res.sendStatus(404);
  }

  try {
    const updatedFarm = await updateFarm({ _id: farmId }, update, {
      new: true,
    });

    return res.send(updatedFarm);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteFarmHandler = async (
  req: Request<GetFarmInput["params"]>,
  res: Response,
) => {
  const farmId = req.params.farmId;
  const farm = await findFarm({ _id: farmId });

  if (!farm) {
    return res.sendStatus(404);
  }

  try {
    await deleteFarm({ _id: farmId });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createFarmHandler,
  deleteFarmHandler,
  getAllFarmHandler,
  getFarmHandler,
  updateFarmHandler,
};
