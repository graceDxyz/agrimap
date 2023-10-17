import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmerModel, { FarmerInput, IFarmer } from "../models/farmer.model";

export async function getAllFarmer() {
  return FarmerModel.aggregate([
    {
      $lookup: {
        from: "farms",
        localField: "_id",
        foreignField: "owner",
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
        localField: "mortgagesIn.farm",
        foreignField: "_id",
        as: "morgageInfarms",
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
                $eq: ["$status", "Active"],
              },
            },
          },
          {
            $lookup: {
              from: "farms",
              let: { farmId: "$farm" },
              pipeline: [
                {
                  $lookup: {
                    from: "farmers",
                    let: { ownerId: "$owner" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$_id", "$$ownerId"],
                          },
                        },
                      },
                    ],
                    as: "ownerDetails",
                  },
                },
              ],
              as: "farmDetails",
            },
          },
        ],
        as: "mortgagesOut",
      },
    },
    {
      $lookup: {
        from: "farms",
        localField: "mortgagesOut.farm",
        foreignField: "_id",
        as: "mortgagesOutfarms",
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
        ownedArea: { $sum: "$farms.size" },
        mortInSize: {
          $sum: "$morgageInfarms.size",
        },
        mortOutSize: {
          $sum: "$mortgagesOutfarms.size",
        },
        totalSize: {
          $subtract: [
            {
              $add: [
                { $ifNull: ["$ownedArea", 0] },
                { $ifNull: ["$mortInSize", 0] },
              ],
            },
            { $ifNull: ["$mortOutSize", 0] },
          ],
        },
      },
    },
  ]);
}

export async function createFarmer(input: FarmerInput) {
  try {
    const farmer = await FarmerModel.create(input);

    return farmer.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findFarmer(query: FilterQuery<IFarmer>) {
  return FarmerModel.findOne(query).lean();
}

export async function updateFarmer(
  query: FilterQuery<IFarmer>,
  update: UpdateQuery<IFarmer>,
  options: QueryOptions,
) {
  return FarmerModel.findByIdAndUpdate(query, update, options);
}

export async function deleteFarmer(query: FilterQuery<IFarmer>) {
  return FarmerModel.deleteOne(query);
}
