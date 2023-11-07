import { StoreState } from "@/lib/store";
import { Mode } from "@/types";
import { Disbursement } from "schema";
import { StateCreator } from "zustand";

type DisbursementMode =
  | {
      mode: "update" | "delete";
      disbursement: Disbursement;
    }
  | {
      mode: "view" | "create";
      disbursement?: Disbursement;
    };

interface State {
  mode: Mode;
  disbursement?: Disbursement;
}

export interface DisbursementSlice {
  disbursement: State & {
    setMode: (mode: DisbursementMode) => void;
  };
}

const intitialState: State = {
  mode: "view",
  disbursement: undefined,
};

export const createDisbursementSlice: StateCreator<
  StoreState,
  [],
  [],
  DisbursementSlice
> = (set) => ({
  disbursement: {
    ...intitialState,
    setMode: (mode) =>
      set(({ disbursement }) => ({
        disbursement: { ...disbursement, ...mode },
      })),
  },
});
