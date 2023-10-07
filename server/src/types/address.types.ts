import * as z from "zod";
import { getAddressSchema } from "../schemas/address.schema";

export type GetAddressInput = z.TypeOf<typeof getAddressSchema>;
export type Province = {
  psgcCode: string;
  name: string;
  label: string;
  value: string;
};

export type City = {
  psgcCode: string;
  name: string;
  provinceCode: string;
  label: string;
  value: string;
};

export type Barangay = {
  psgcCode: string;
  name: string;
  provinceCode: string;
  cityMunCode: string;
  label: string;
  value: string;
};
