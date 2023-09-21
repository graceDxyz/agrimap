import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MortgageModel, {
  MortgageInput,
  IMortgage,
} from "../models/mortgage.model";

export async function getAllMortgage() {
  return MortgageModel.find()
    .populate("farm")
    .populate("mortgageTo")
    .sort({ "mortgageTo.lastname": 1 });
}

export async function createMortgage(input: MortgageInput) {
  try {
    const mortgage = await MortgageModel.create(input);

    await mortgage.populate("farm").populate("mortgageTo");
    return mortgage.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findMortgage(query: FilterQuery<IMortgage>) {
  return MortgageModel.findOne(query)
    .populate("farm")
    .populate("mortgageTo")
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
