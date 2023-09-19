import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmModel, { FarmInput, IFarm } from "../models/farm.model";

export async function getAllFarm() {
  return FarmModel.find().populate("owner").sort({ "owner.firstname": 1 });
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
  return FarmModel.findOne(query).lean();
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
