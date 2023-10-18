import mongoose from "mongoose";
import { IFarmer } from "./farmer.model";

export interface FarmInput {
  owner: IFarmer["_id"];
  titleNumber: string;
  proofFiles: {
    fileKey: string;
    fileName: string;
    fileUrl: string;
  }[];
  size: number;
  coordinates: [number, number][][];
  address: {
    streetAddress: string;
    cityOrProvince: string;
    municipality: string;
    barangay: string;
    zipcode: string;
  };
  isArchived: boolean;
  crops: string[];
}

export interface IFarm extends FarmInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    titleNumber: {
      type: String,
      required: true,
      unique: true,
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
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
    address: {
      streetAddress: {
        type: String,
      },
      cityOrProvince: {
        type: String,
      },
      municipality: {
        type: String,
      },
      barangay: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    crops: {
      type: [String],
      default: [],
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

const FarmModel = mongoose.model<IFarm>("Farm", farmSchema);

export default FarmModel;
