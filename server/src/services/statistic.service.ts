import dayjs from "dayjs";
import FarmerModel from "../models/farmer.model";

export async function getStatistics() {
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
      },
    },
  ]);

  const todayFarmers = result[0].todayFarmers;
  const count = result[0].monthlyCount[0]?.count || 0;

  return {
    todayFarmers,
    count,
  };
}
