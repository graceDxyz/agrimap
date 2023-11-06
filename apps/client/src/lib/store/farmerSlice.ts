import { Mode } from "@/types";
import { Farmer } from "schema";
import { StateCreator } from "zustand";
import { StoreState } from ".";

type FarmerMode =
  | {
      mode: "update" | "delete";
      farmer: Farmer;
    }
  | {
      mode: "view" | "create";
      farmer?: Farmer;
    };

interface State {
  mode: Mode;
  farmer?: Farmer;
}

export interface FarmerSlice {
  farmer: State & {
    setMode: (mode: FarmerMode) => void;
  };
}

const intitialState: State = {
  mode: "view",
  farmer: undefined,
};

export const createFarmerSlice: StateCreator<
  StoreState,
  [],
  [],
  FarmerSlice
> = (set) => ({
  farmer: {
    ...intitialState,
    setMode: (mode) =>
      set(({ farmer }) => ({ farmer: { ...farmer, ...mode } })),
  },
});
