import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MortgageModel, {
  IMortgage,
  MortgageInput,
} from "../models/mortgage.model";

export async function getAllMortgage() {
  return MortgageModel.find()
    .populate([{ path: "farm", populate: { path: "owner" } }, "mortgageTo"])
    .sort({ "mortgageTo.lastname": 1 });
  // return MortgageModel.aggregate([
  //{
  //   $and: [{ farm: { $ne: null } }, { mortgageTo: { $ne: null } }],
  // }
  //   {
  //     $lookup: {
  //       from: "farms", // Assuming 'farms' is the name of the collection to populate from
  //       localField: "farm",
  //       foreignField: "_id",
  //       as: "farm",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "farmers", // Replace with the actual name of the collection to populate from
  //       localField: "mortgageTo",
  //       foreignField: "_id",
  //       as: "mortgageTo",
  //     },
  //   },
  //   {
  //     $match: {
  //       $and: [
  //         { farm: { $ne: [] } }, // Check if farm is not an empty array
  //         { mortgageTo: { $ne: [] } }, // Check if mortgageTo is not an empty array
  //       ],
  //     },
  //   },
  //   {
  //     $sort: { "mortgageTo.lastname": 1 },
  //   },
  // ]);
}

export async function createMortgage(input: MortgageInput) {
  try {
    const mortgage = await MortgageModel.create(input);

    await mortgage.populate([
      { path: "farm", populate: { path: "owner" } },
      "mortgageTo",
    ]);
    return mortgage.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findMortgage(query: FilterQuery<IMortgage>) {
  return MortgageModel.findOne(query)
    .populate([{ path: "farm", populate: { path: "owner" } }, "mortgageTo"])
    .lean();
}

export async function updateMortgage(
  query: FilterQuery<IMortgage>,
  update: UpdateQuery<IMortgage>,
  options: QueryOptions,
) {
  return MortgageModel.findByIdAndUpdate(query, update, options);
}

export async function deleteMortgage(query: FilterQuery<IMortgage>) {
  return MortgageModel.deleteOne(query);
}

export async function deleteMortgages(query: FilterQuery<IMortgage>) {
  return MortgageModel.deleteMany(query);
}
