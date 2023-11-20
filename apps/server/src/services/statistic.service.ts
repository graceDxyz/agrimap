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
        todayFarmers: {
          $cond: {
            if: { $eq: ["$todayFarmers", []] },
            then: [], // Default value for todayFarmers when empty
            else: "$todayFarmers",
          },
        },
        count: {
          $cond: {
            if: { $eq: ["$monthlyCount", []] },
            then: 0, // Default value for count when empty
            else: { $arrayElemAt: ["$monthlyCount.count", 0] },
          },
        },
      },
    },
  ]);

  return result[0];
}

export function getStatisticsCount() {
  return FarmerModel.aggregate([
    {
      $lookup: {
        from: "farms",
        let: { farmerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$farmerId"] },
                  { $eq: ["$isArchived", false] },
                ],
              },
            },
          },
        ],
        as: "farms",
      },
    },
    {
      $lookup: {
        from: "mortgages",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$mortgageTo", "$$userId"],
                  },
                  { $eq: ["$status", "Active"] },
                ],
              },
            },
          },
        ],
        as: "mortgagesIn",
      },
    },
    {
      $lookup: {
        from: "farms",
        let: { farmId: "$mortgagesIn.farm" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$farmId"] },
                  { $eq: ["$isArchive", false] },
                ],
              },
            },
          },
        ],
        as: "mortgageInFarms",
      },
    },
    {
      $lookup: {
        from: "mortgages",
        localField: "farms._id",
        foreignField: "farm",
        as: "mortgagesOut",
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        firstname: 1,
        lastname: 1,
        middleInitial: 1,
        address: 1,
        phoneNumber: 1,
        createdAt: 1,
        updatedAt: 1,
        totalFarmSize: { $sum: "$farms.size" },
        totalMortgageFarmSize: { $sum: "$mortgagesOut.size" },
      },
    },
    {
      $group: {
        _id: null,
        totalFarmers: { $sum: 1 },
        totalFarmSize: { $sum: "$totalFarmSize" },
        totalMortgageSize: { $sum: "$totalMortgageFarmSize" },
      },
    },
  ]);
}
