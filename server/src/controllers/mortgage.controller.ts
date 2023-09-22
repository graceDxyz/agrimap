import { Request, Response } from "express";
import {
  createMortgage,
  deleteMortgage,
  findMortgage,
  getAllMortgage,
  updateMortgage,
} from "../services/mortgage.service";
import {
  CreateMortgageInput,
  GetMortgageInput,
  UpdateMortgageInput,
} from "../types/mortgage.types";
import logger from "../utils/logger";

const getAllMortgageHandler = async (req: Request, res: Response) => {
  const mortgages = await getAllMortgage();
  return res.send(mortgages);
};

const getMortgageHandler = async (
  req: Request<GetMortgageInput["params"]>,
  res: Response,
) => {
  const mortgageId = req.params.mortgageId;

  const mortgage = await findMortgage({ _id: mortgageId });

  if (!mortgage) {
    return res.sendStatus(404);
  }

  return res.send(mortgage);
};

const createMortgageHandler = async (
  req: Request<{}, {}, CreateMortgageInput["body"]>,
  res: Response,
) => {
  try {
    const body = req.body;

    const mortgage = await createMortgage({
      ...body,
      farm: body.farmId,
      mortgageTo: body.mortgageToId,
    });

    return res.send(mortgage);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const updateMortgageHandler = async (
  req: Request<UpdateMortgageInput["params"]>,
  res: Response,
) => {
  const mortgageId = req.params.mortgageId;
  const update = req.body;

  const mortgage = await findMortgage({ _id: mortgageId });

  if (!mortgage) {
    return res.sendStatus(404);
  }

  try {
    const updatedMortgage = await updateMortgage(
      { _id: mortgageId },
      { ...update, farm: update.farmId, mortgageTo: update.mortgageToId },
      {
        new: true,
        populate: [{ path: "farm", populate: "owner" }, { path: "mortgageTo" }],
      },
    );

    return res.send(updatedMortgage);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteMortgageHandler = async (
  req: Request<GetMortgageInput["params"]>,
  res: Response,
) => {
  const mortgageId = req.params.mortgageId;
  const mortgage = await findMortgage({ _id: mortgageId });

  if (!mortgage) {
    return res.sendStatus(404);
  }

  try {
    await deleteMortgage({ _id: mortgageId });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createMortgageHandler,
  deleteMortgageHandler,
  getAllMortgageHandler,
  getMortgageHandler,
  updateMortgageHandler,
};
