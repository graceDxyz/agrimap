import mongoose from "mongoose";

export interface FarmerInput {
  firstname: string;
  lastname: string;
  address: string;
  phoneNumber: string;
}

export interface IFarmer extends FarmerInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
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

const FarmerModel = mongoose.model<IFarmer>("Farmer", farmerSchema);

export default FarmerModel;
