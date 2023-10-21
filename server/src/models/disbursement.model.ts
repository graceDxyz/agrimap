import mongoose from "mongoose";
import { IFarmer } from "./farmer.model";

export interface DisbursementInput {
  farmer: IFarmer["_id"];
  assistanceName: string[];
  receivedDate: string;
}

export interface IDisbursement extends DisbursementInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const disbursementSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    assistanceName: { type: [String], default: [] },
    receivedDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

const Disbursement = mongoose.model<IDisbursement>(
  "Disbursement",
  disbursementSchema
);

export default Disbursement;
