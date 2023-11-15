import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmModel, { FarmInput, IFarm } from "../models/farm.model";
import MortgageModel from "../models/mortgage.model";

export async function getAllFarm() {
  return FarmModel.aggregate([
    {
      $lookup: {
        from: "mortgages",
        localField: "_id",
        foreignField: "farm",
        as: "mortgages",
        pipeline: [
          {
            $lookup: {
              from: "farmers",
              localField: "mortgageTo",
              foreignField: "_id",
              as: "mortgageTo",
            },
          },
          {
            $lookup: {
              from: "farms",
              localField: "farm",
              foreignField: "_id",
              as: "farm",
            },
          },
          {
            $addFields: {
              mortgageTo: { $arrayElemAt: ["$mortgageTo", 0] },
              farm: { $arrayElemAt: ["$farm", 0] },
            },
          },
        ],
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
          $in: ["Active", "$mortgages.status"],
        },
        mortgages: "$mortgages",
      },
    },
    {
      $sort: { titleNumber: 1 },
    },
  ]);
}

export async function findFarm(query: FilterQuery<IFarm>) {
  const farm = await FarmModel.findOne(query).populate("owner").lean();
  if (!farm) return farm;

  const mortgages = await MortgageModel.find({ farm: query._id })
    .populate(["farm", "mortgageTo"])
    .lean();

  return { ...farm, mortgages };
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

export async function updateFarm(
  query: FilterQuery<IFarm>,
  update: UpdateQuery<IFarm>,
  options: QueryOptions,
) {
  return FarmModel.findByIdAndUpdate(query, update, options);
}

export async function deleteFarm(query: FilterQuery<IFarm>) {
  return FarmModel.deleteOne(query);
}

export async function deleteFarms(query: FilterQuery<IFarm>) {
  return FarmModel.deleteMany(query);
}

export async function getAllFarmCrops() {
  const result = await FarmModel.aggregate([
    {
      $project: {
        crops: 1,
        _id: 0,
      },
    },
    {
      $unwind: "$crops",
    },
    {
      $group: {
        _id: null,
        allCrops: { $addToSet: "$crops" },
      },
    },
    {
      $unwind: "$allCrops",
    },
    {
      $sort: { allCrops: 1 }, // Sort the crops alphabetically
    },
    {
      $group: {
        _id: null,
        allCrops: { $push: "$allCrops" },
      },
    },
  ]);

  return result.length > 0 ? result[0].allCrops : [];
}
