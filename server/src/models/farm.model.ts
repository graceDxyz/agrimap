import mongoose from "mongoose";
import { IFarmer } from "./farmer.model";

export interface FarmInput {
  owner: IFarmer["_id"];
  proof: string;
  hectar: number;
  coordinates: [number, number][][];
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
    proof: { type: String },
    hectar: { type: Number, required: true, default: 0 },
    coordinates: {
      type: [[[Number]]],
      required: true,
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
