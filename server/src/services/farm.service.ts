import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmModel, { FarmInput, IFarm } from "../models/farm.model";

export async function getAllFarm() {
  return FarmModel.aggregate([
    {
      $lookup: {
        from: "mortgages",
        localField: "_id",
        foreignField: "farm",
        as: "activeMortgages",
      },
    },
    {
      $lookup: {
        from: "farmers",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
        isMortgage: {
          $in: ["Active", "$activeMortgages.status"],
        },
      },
    },
    {
      $sort: { titleNumber: 1 },
    },
  ]);
}

export async function createFarm(input: FarmInput) {
  try {
    const farm = await FarmModel.create(input);

    await farm.populate("owner");
    return farm.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findFarm(query: FilterQuery<IFarm>) {
  return FarmModel.findOne(query).populate("owner").lean();
}

export async function updateFarm(
  query: FilterQuery<IFarm>,
  update: UpdateQuery<IFarm>,
  options: QueryOptions
) {
  return FarmModel.findByIdAndUpdate(query, update, options);
}

export async function deleteFarm(query: FilterQuery<IFarm>) {
  return FarmModel.deleteOne(query);
}

export async function deleteFarms(query: FilterQuery<IFarm>) {
  return FarmModel.deleteMany(query);
}
