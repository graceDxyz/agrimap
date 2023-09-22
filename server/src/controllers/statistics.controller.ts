import { Request, Response } from "express";
import { getStatistics } from "../services/statistic.service";

const getAllStatisticsHandler = async (req: Request, res: Response) => {
  const statistics = await getStatistics();
  return res.send(statistics);
};

export { getAllStatisticsHandler };
