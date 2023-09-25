import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Request, Response } from "express";
import FarmerModel from "../models/farmer.model";
import { getStatisticsRecent } from "../services/statistic.service";
import { StatsQuery } from "../types/farmer.types";
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
  const queryBy = req.query.by;

  const today = qYear ? dayjs().year(qYear) : dayjs();
  let startDate = today.startOf("day");
  let endDate = today.endOf("day");

  const tempList: Array<string | number> = [];

  if (queryBy === "Annually") {
    startDate = today.endOf("year").subtract(4, "year");
    endDate = today.endOf("year");

    const currentYear = today.year();
    tempList.push(
      ...Array.from({ length: 5 }, (_, index) => currentYear - index).reverse(),
    );
  }

  if (queryBy === "Monthly") {
    startDate = today.startOf("year");
    endDate = today.endOf("year");

    const currentMonthIndex = today.month(); // Get the current month index (0-indexed)
    for (let i = 1; i <= 12; i++) {
      const monthName = today.month((currentMonthIndex + i) % 12).format("MMM");
      tempList.push(monthName);
    }
  }

  if (queryBy === "Weekly") {
    startDate = endDate.subtract(1, "week");
    const currentDay = today.day(); // Get the current day of the week (0-indexed, where 0 is Sunday)

    for (let i = 1; i <= 7; i++) {
      const dayName = today.day((currentDay + i) % 7).format("ddd");
      tempList.push(dayName);
    }
  }

  const pipeline = [];

  pipeline.push({
    $match: {
      createdAt: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate(),
      },
    },
  });

  if (queryBy === "Annually") {
    pipeline.push({
      $group: {
        _id: { $year: "$createdAt" }, // Group by year using $year
        count: { $sum: 1 },
      },
    });
  }

  if (queryBy === "Monthly") {
    // pipeline.push({
    //   $group: {
    //     _id: { $dateToString: { format: "%b", date: "$createdAt" } },
    //     count: { $sum: 1 },
    //   },
    // });
    pipeline.push({
      $group: {
        _id: {
          $let: {
            vars: {
              monthNumeric: { $month: "$createdAt" },
            },
            in: {
              $switch: {
                branches: [
                  { case: { $eq: ["$$monthNumeric", 1] }, then: "Jan" },
                  { case: { $eq: ["$$monthNumeric", 2] }, then: "Feb" },
                  { case: { $eq: ["$$monthNumeric", 3] }, then: "Mar" },
                  { case: { $eq: ["$$monthNumeric", 4] }, then: "Apr" },
                  { case: { $eq: ["$$monthNumeric", 5] }, then: "May" },
                  { case: { $eq: ["$$monthNumeric", 6] }, then: "Jun" },
                  { case: { $eq: ["$$monthNumeric", 7] }, then: "Jul" },
                  { case: { $eq: ["$$monthNumeric", 8] }, then: "Aug" },
                  { case: { $eq: ["$$monthNumeric", 9] }, then: "Sep" },
                  { case: { $eq: ["$$monthNumeric", 10] }, then: "Oct" },
                  { case: { $eq: ["$$monthNumeric", 11] }, then: "Nov" },
                  { case: { $eq: ["$$monthNumeric", 12] }, then: "Dec" },
                ],
                default: "Unknown", // Default value if the month number is unexpected
              },
            },
          },
        },
        count: { $sum: 1 },
      },
    });
  }

  if (queryBy === "Weekly") {
    pipeline.push({
      $group: {
        _id: { $dayOfWeek: "$createdAt" }, // Extract the day of the week as a number (0-6)
        count: { $sum: 1 },
      },
    });
  }
  const result = await FarmerModel.aggregate(pipeline);

  const data = tempList.map((_id) => {
    const match = result.find(
      (resData: { _id: string | number; count: number }) => {
        const tempId =
          queryBy === "Weekly"
            ? today.day((resData._id as number) - 1).format("ddd")
            : resData._id;
        return tempId === _id;
      },
    );
    return {
      _id,
      count: match ? match.count : 0,
    };
  });
  return res.send(data);
};

export { getStatHandler, getStatRecentHandler };

// function getStartAndEndDateOfWeek(year: number, weekNumber: number) {
//   return [
//     dayjs().year(year).isoWeek(weekNumber).startOf("isoWeek"),
//     dayjs().year(year).isoWeek(weekNumber).endOf("isoWeek"),
//   ];
// }
