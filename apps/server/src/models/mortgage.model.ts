import mongoose from "mongoose";
import { IFarm } from "./farm.model";
import { IFarmer } from "./farmer.model";

export interface MortgageInput {
  farm: IFarm["_id"];
  mortgageTo: IFarmer["_id"];
  mortgageAmount: number;
  mortgageDate: {
    from: string;
    to: string;
  };
  status?: "Active" | "Paid Off" | "Defaulted";
  size: number;
  coordinates: [number, number][][];
  proofFiles: {
    fileKey: string;
    fileName: string;
    fileUrl: string;
  }[];
}

export interface IMortgage extends MortgageInput, mongoose.Document {
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
    mortgageDate: {
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Paid Off", "Defaulted"],
      default: "Active",
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
    proofFiles: {
      type: [
        {
          fileKey: { type: String },
          fileName: { type: String },
          fileUrl: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

const MortgageModel = mongoose.model("Mortgage", mortgageSchema);

export default MortgageModel;
