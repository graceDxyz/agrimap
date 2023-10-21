import { Request, Response } from "express";
import {
  createDisbursement,
  deleteDisbursement,
  findDisbursement,
  getAllDisbursement,
  updateDisbursement,
} from "../services/disbursement.service";
import { deleteFarms } from "../services/farm.service";
import { deleteMortgages } from "../services/mortgage.service";
import {
  CreateDisbursementInput,
  GetDisbursementInput,
  UpdateDisbursementInput,
} from "../types/disbursement.types";
import logger from "../utils/logger";

const getAllDisbursementHandler = async (req: Request, res: Response) => {
  const disbursements = await getAllDisbursement();
  return res.send(disbursements);
};

const getDisbursementHandler = async (
  req: Request<GetDisbursementInput["params"]>,
  res: Response
) => {
  const disbursementId = req.params.disbursementId;

  const disbursement = await findDisbursement({ _id: disbursementId });

  if (!disbursement) {
    return res.sendStatus(404);
  }

  return res.send(disbursement);
};

const createDisbursementHandler = async (
  req: Request<{}, {}, CreateDisbursementInput["body"]>,
  res: Response
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
  req: Request<UpdateDisbursementInput["params"]>,
  res: Response
) => {
  const disbursementId = req.params.disbursementId;
  const update = req.body;

  const disbursement = await findDisbursement({ _id: disbursementId });

  if (!disbursement) {
    return res.sendStatus(404);
  }

  try {
    const updatedDisbursement = await updateDisbursement(
      { _id: disbursementId },
      update,
      {
        new: true,
      }
    );

    return res.send(updatedDisbursement);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteDisbursementHandler = async (
  req: Request<GetDisbursementInput["params"]>,
  res: Response
) => {
  const disbursementId = req.params.disbursementId;
  const disbursement = await findDisbursement({ _id: disbursementId });

  if (!disbursement) {
    return res.sendStatus(404);
  }

  try {
    await deleteDisbursement({ _id: disbursementId });
    await deleteFarms({ owner: disbursementId });
    await deleteMortgages({ mortgageTo: disbursementId });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createDisbursementHandler,
  deleteDisbursementHandler,
  getAllDisbursementHandler,
  getDisbursementHandler,
  updateDisbursementHandler,
};
