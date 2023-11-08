import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  findUser,
  getAllUser,
  updateUser,
} from "../services/user.service";
import { CreateUserInput, GetUserInput } from "../types/user.types";
import logger from "../utils/logger";

const getAllUserHandler = async (req: Request, res: Response) => {
  const users = await getAllUser();
  return res.send(users);
};

const getUserHandler = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  try {
    const id = req.params.id;

    const user = await findUser({ _id: id });

    if (!user) {
      return res.sendStatus(404);
    }

    return res.send(user);
  } catch (error: any) {
    logger.error(error);
    return res.status(404).send(error.message);
  }
};

const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const body = req.body;

    const user = await createUser({
      ...body,
    });

    return res.send(user);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const updateUserHandler = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  const id = req.params.id;
  const update = req.body;

  const user = await findUser({ _id: id });

  if (!user) {
    return res.sendStatus(404);
  }

  try {
    const updatedUser = await updateUser({ _id: id }, update, {
      new: true,
    });

    return res.send(updatedUser);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteUserHandler = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  const id = req.params.id;
  const user = await findUser({ _id: id });

  if (!user) {
    return res.sendStatus(404);
  }

  try {
    await deleteUser({ _id: id });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
};
