import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmerModel, { FarmerInput, IFarmer } from "../models/farmer.model";

export async function getAllFarmer() {
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
      $unwind: {
        path: "$farms",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "mortgages",
        localField: "farms._id",
        foreignField: "farm",
        as: "activeMortgages",
      },
    },
    {
      $match: {
        "activeMortgages.status": { $ne: "Active" },
      },
    },
    {
      $group: {
        _id: "$_id",
        id: { $first: "$_id" },
        firstname: { $first: "$firstname" },
        lastname: { $first: "$lastname" },
        middleInitial: { $first: "$middleInitial" },
        address: { $first: "$address" },
        phoneNumber: { $first: "$phoneNumber" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        totalSize: { $sum: "$farms.size" },
      },
    },
    {
      $lookup: {
        from: "mortgages",
        let: { farmerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$mortgageTo", "$$farmerId"] },
            },
          },
          {
            $lookup: {
              from: "farms",
              localField: "farm",
              foreignField: "_id",
              as: "farmDetails",
            },
          },
          {
            $unwind: {
              path: "$farmDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: null,
              totalFarmSize: { $sum: "$farmDetails.size" },
            },
          },
        ],
        as: "farmSize",
      },
    },
    {
      $unwind: {
        path: "$farmSize",
        preserveNullAndEmptyArrays: true,
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
        totalSize: { $sum: ["$totalSize", "$farmSize.totalFarmSize"] },
      },
    },
    {
      $sort: {
        lastname: 1,
        firstname: 1,
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
  options: QueryOptions
) {
  return FarmerModel.findByIdAndUpdate(query, update, options);
}

export async function deleteFarmer(query: FilterQuery<IFarmer>) {
  return FarmerModel.deleteOne(query);
}
