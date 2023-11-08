import { Request, Response } from "express";
import {
  createFarm,
  deleteFarm,
  findFarm,
  getAllFarm,
  getAllFarmCrops,
  updateFarm,
} from "../services/farm.service";
import { deleteMortgages } from "../services/mortgage.service";
import { CreateFarmInput, GetFarmInput } from "../types/farm.types";
import logger from "../utils/logger";

const getAllFarmHandler = async (req: Request, res: Response) => {
  const farms = await getAllFarm();
  return res.send(farms);
};

const getAllFarmCropsHandler = async (req: Request, res: Response) => {
  const crops = await getAllFarmCrops();
  return res.send(crops);
};

const getFarmHandler = async (
  req: Request<GetFarmInput["params"]>,
  res: Response,
) => {
  try {
    const id = req.params.id;

    const farm = await findFarm({ _id: id });

    if (!farm) {
      return res.sendStatus(404);
    }

    return res.send(farm);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
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
  req: Request<GetFarmInput["params"]>,
  res: Response,
) => {
  const id = req.params.id;
  const update = req.body;

  const farm = await findFarm({ _id: id });

  if (!farm) {
    return res.sendStatus(404);
  }

  try {
    const updatedFarm = await updateFarm({ _id: id }, update, {
      new: true,
      populate: "owner",
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
  const id = req.params.id;
  const farm = await findFarm({ _id: id });

  if (!farm) {
    return res.sendStatus(404);
  }

  try {
    await deleteFarm({ _id: id });
    await deleteMortgages({ farm: id });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

const archivedFarmHandler = async (
  req: Request<GetFarmInput["params"]>,
  res: Response,
) => {
  const id = req.params.id;
  const farm = await findFarm({ _id: id });

  if (!farm) {
    return res.sendStatus(404);
  }

  try {
    const updatedFarm = await updateFarm(
      { _id: id },
      {
        $set: { isArchived: !farm.isArchived },
      },
      {
        new: true,
        populate: "owner",
      },
    );

    return res.send(updatedFarm);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  archivedFarmHandler,
  createFarmHandler,
  deleteFarmHandler,
  getAllFarmCropsHandler,
  getAllFarmHandler,
  getFarmHandler,
  updateFarmHandler,
};
