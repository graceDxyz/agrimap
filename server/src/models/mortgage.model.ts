import mongoose from "mongoose";
import { IFarmer } from "./farmer.model";
import { IFarm } from "./farm.model";

export interface MorgateInput {
  farm: IFarm["_id"];
  mortgageTo: IFarmer["_id"];
  mortgageAmount: number;
  startDate: Date;
  endDate: Date;
  status?: "Active" | "Paid Off" | "Defaulted";
}

export interface IMortgage extends MorgateInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const mortgageSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    mortgageTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    mortgageAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Paid Off", "Defaulted"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

const MortgageModel = mongoose.model("Mortgage", mortgageSchema);

export default MortgageModel;
