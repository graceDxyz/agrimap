import { getAllUser } from "../services/user.service";
import { Request, Response } from "express";

const getAllUserHandler = async (req: Request, res: Response) => {
  const users = await getAllUser();
  return res.send(users);
};

export { getAllUserHandler };
