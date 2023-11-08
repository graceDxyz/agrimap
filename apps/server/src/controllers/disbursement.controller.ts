import { Request, Response } from "express";
import {
  createDisbursement,
  deleteDisbursement,
  findDisbursement,
  getAllAssistances,
  getAllDisbursement,
  updateDisbursement,
} from "../services/disbursement.service";
import { deleteFarms } from "../services/farm.service";
import { deleteMortgages } from "../services/mortgage.service";
import {
  CreateDisbursementInput,
  GetDisbursementInput,
} from "../types/disbursement.types";
import logger from "../utils/logger";

const getAllDisbursementHandler = async (req: Request, res: Response) => {
  const disbursements = await getAllDisbursement();
  return res.send(disbursements);
};

const getAllAssistancesHandler = async (req: Request, res: Response) => {
  const assistances = await getAllAssistances();
  return res.send(assistances);
};

const getDisbursementHandler = async (
  req: Request<GetDisbursementInput["params"]>,
  res: Response,
) => {
  try {
    const id = req.params.id;

    const disbursement = await findDisbursement({ _id: id });

    if (!disbursement) {
      return res.sendStatus(404);
    }

    return res.send(disbursement);
  } catch (error: any) {
    logger.error(error);
    return res.status(404).send(error.message);
  }
};

const createDisbursementHandler = async (
  req: Request<{}, {}, CreateDisbursementInput["body"]>,
  res: Response,
) => {
  try {
    const body = req.body;

    const disbursement = await createDisbursement({
      ...body,
    });

    return res.send(disbursement);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const updateDisbursementHandler = async (
  req: Request<GetDisbursementInput["params"]>,
  res: Response,
) => {
  const id = req.params.id;
  const update = req.body;

  const disbursement = await findDisbursement({ _id: id });

  if (!disbursement) {
    return res.sendStatus(404);
  }

  try {
    const updatedDisbursement = await updateDisbursement({ _id: id }, update, {
      new: true,
    });

    return res.send(updatedDisbursement);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteDisbursementHandler = async (
  req: Request<GetDisbursementInput["params"]>,
  res: Response,
) => {
  const id = req.params.id;
  const disbursement = await findDisbursement({ _id: id });

  if (!disbursement) {
    return res.sendStatus(404);
  }

  try {
    await deleteDisbursement({ _id: id });
    await deleteFarms({ owner: id });
    await deleteMortgages({ mortgageTo: id });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createDisbursementHandler,
  deleteDisbursementHandler,
  getAllAssistancesHandler,
  getAllDisbursementHandler,
  getDisbursementHandler,
  updateDisbursementHandler,
};
