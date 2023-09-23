import { Request, Response } from "express";
import { getStatisticsRecent } from "../services/statistic.service";
import dayjs from "dayjs";
import FarmerModel from "../models/farmer.model";
import { StatsQuery } from "../types/farmer.types";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const getStatRecentHandler = async (req: Request, res: Response) => {
  const statistics = await getStatisticsRecent();
  return res.send(statistics);
};

const getStatHandler = async (
  req: Request<{}, {}, {}, StatsQuery>,
  res: Response,
) => {
  const qYear = req.query.year;
  const qMonth = req.query.month;
  const qWeek = req.query.week;

  let startDate, endDate;
  const today = qYear ? dayjs().year(qYear) : dayjs();

  if (qWeek) {
    const [weekStartDate, weekEndDate] = getStartAndEndDateOfWeek(
      today.year(),
      qWeek,
    );
    startDate = weekStartDate;
    endDate = weekEndDate;
  } else if (qMonth) {
    startDate = today.month(qMonth - 1).startOf("month");
    endDate = today.month(qMonth - 1).endOf("month");
  } else {
    startDate = today.startOf("year");
    endDate = today.endOf("year");
  }

  function getStartAndEndDateOfWeek(year: number, weekNumber: number) {
    return [
      dayjs().year(year).isoWeek(weekNumber).startOf("isoWeek"),
      dayjs().year(year).isoWeek(weekNumber).endOf("isoWeek"),
    ];
  }
  const pipeline = [];

  console.log({ start: startDate.toDate(), end: endDate.toDate() });
  pipeline.push({
    $match: {
      createdAt: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate(),
      },
    },
  });
  const queryRes = await FarmerModel.aggregate(pipeline);
  return res.send({
    start: startDate.toDate(),
    end: endDate.toDate(),
    data: queryRes,
  });
};

export { getStatRecentHandler, getStatHandler };
