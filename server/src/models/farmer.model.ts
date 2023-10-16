import mongoose from "mongoose";

export interface FarmerInput {
  firstname: string;
  lastname: string;
  middleInitial: string;
  address: {
    streetAddress: string;
    cityOrProvince: string;
    municipality: string;
    barangay: string;
    zipcode: string;
  };
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
    middleInitial: {
      type: String,
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
    phoneNumber: {
      type: String,
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

const FarmerModel = mongoose.model<IFarmer>("Farmer", farmerSchema);

export default FarmerModel;
