import { uploadRouter } from "../utils/uploadthing";

export type OurFileRouter = typeof uploadRouter;

export interface Farm {
  owner: {
    lastname: string;
    firstname: string;
  };
  titleNumber: string;
  size: number;
  address: {
    streetAddress: string;
    cityOrProvince: string;
    municipality: string;
    barangay: string;
    zipcode: string;
  };
}

export interface MortgageTo {
  lastname: string;
  firstname: string;
}
