import dayjs from "dayjs";
import FarmerModel from "../models/farmer.model";

export async function getStatisticsRecent() {
  const today = dayjs();
  // const todayStart = today.startOf("day");
  const todayEnd = today.endOf("day");
  const currentMonthStart = today.startOf("month");

  const result = await FarmerModel.aggregate([
    {
      $facet: {
        todayFarmers: [
          {
            $match: {
              createdAt: {
                $gte: currentMonthStart.toDate(),
                $lte: todayEnd.toDate(),
              },
            },
          },
          {
            $sort: {
              createdAt: -1, // 1 for ascending order, -1 for descending order
            },
          },
          {
            $limit: 5, // Limit to 5 documents
          },
        ],
        monthlyCount: [
          {
            $match: {
              createdAt: {
                $gte: currentMonthStart.toDate(),
                $lte: todayEnd.toDate(),
              },
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
    {
      $project: {
        todayFarmers: 1,
        count: { $arrayElemAt: ["$monthlyCount.count", 0] },
      },
    },
  ]);

  return result[0];
}

export async function getStatisticsOld() {
  const today = dayjs();
  const todayStart = today.startOf("day");
  const todayEnd = today.endOf("day");
  const currentMonthStart = today.startOf("month");

  const result = await FarmerModel.aggregate([
    {
      $facet: {
        todayFarmers: [
          {
            $match: {
              createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
            },
          },
        ],
        monthlyCount: [
          {
            $match: {
              createdAt: {
                $gte: currentMonthStart.toDate(),
                $lte: todayEnd.toDate(),
              },
            },
          },
          {
            $count: "count",
          },
        ],
        annuallyData: [
          {
            $group: {
              _id: { $dateToString: { format: "%b", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ],
        monthlyData: [
          {
            $group: {
              _id: { $week: "$createdAt" },
              count: { $sum: 1 },
            },
          },
        ],
        weeklyData: [
          {
            $group: {
              _id: { $week: { date: "$createdAt", timezone: "Asia/Manila" } },
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        todayFarmers: 1,
        count: { $arrayElemAt: ["$monthlyCount.count", 0] },
        annuallyData: 1,
        monthlyData: 1,
        weeklyData: 1,
      },
    },
  ]);

  const annuallyData = months.map((month) => {
    const match = result[0].annuallyData.find(
      (monthData: { _id: string; count: number }) => monthData._id === month,
    );
    return {
      name: month,
      count: match ? match.count : 0,
    };
  });

  const weeklyData = days.map((day, index) => {
    const dayNumber = index + 1; // Convert day name to number
    const match = result[0].weeklyData.find(
      (dayData: { _id: number; count: number }) => dayData._id === dayNumber,
    );
    return {
      name: day,
      count: match ? match.count : 0,
    };
  });

  return { ...result[0], annuallyData, weeklyData };
}

const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
