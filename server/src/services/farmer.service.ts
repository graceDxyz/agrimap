import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmerModel, { FarmerInput, IFarmer } from "../models/farmer.model";

export async function getAllFarmer() {
  // return FarmerModel.find().sort({ firstname: 1 });
  return FarmerModel.aggregate([
    {
      $lookup: {
        from: "farms", // The name of the Farm collection
        localField: "_id",
        foreignField: "owner",
        as: "farms",
      },
    },
    {
      $project: {
        _id: 1,
        id: "$_id",
        firstname: 1,
        lastname: 1,
        address: 1,
        phoneNumber: 1,
        createdAt: 1,
        updatedAt: 1,
        totalSize: { $sum: "$farms.size" },
      },
    },
    {
      $sort: {
        lastname: 1, // 1 for ascending, -1 for descending
        firstname: 1, // 1 for ascending, -1 for descending
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
