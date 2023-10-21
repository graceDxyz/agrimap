import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import DisbursementModel, {
  DisbursementInput,
  IDisbursement,
} from "../models/disbursement.model";

export async function getAllDisbursement() {
  return DisbursementModel.find().populate("farmer").sort({ created: -1 });
}

export async function createDisbursement(input: DisbursementInput) {
  try {
    const disbursement = await DisbursementModel.create(input);
    await disbursement.populate("farmer");
    return disbursement.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findDisbursement(query: FilterQuery<IDisbursement>) {
  return await DisbursementModel.findOne(query).populate("farmer").lean();
}

export async function updateDisbursement(
  query: FilterQuery<IDisbursement>,
  update: UpdateQuery<IDisbursement>,
  options: QueryOptions
) {
  return DisbursementModel.findByIdAndUpdate(query, update, options);
}

export async function deleteDisbursement(query: FilterQuery<IDisbursement>) {
  return DisbursementModel.deleteOne(query);
}

export async function deleteDisbursements(query: FilterQuery<IDisbursement>) {
  return DisbursementModel.deleteMany(query);
}
