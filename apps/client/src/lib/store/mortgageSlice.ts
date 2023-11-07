import { StoreState } from "@/lib/store";
import { Mode } from "@/types";
import { Mortgage } from "schema";
import { StateCreator } from "zustand";

type MortgageMode =
  | {
      mode: "update" | "delete";
      mortgage: Mortgage;
    }
  | {
      mode: "view" | "create";
      mortgage?: Mortgage;
    };

interface State {
  mode: Mode;
  mortgage?: Mortgage;
}

export interface MortgageSlice {
  mortgage: State & {
    setMode: (mode: MortgageMode) => void;
  };
}

const intitialState: State = {
  mode: "view",
  mortgage: undefined,
};

export const createMortgageSlice: StateCreator<
  StoreState,
  [],
  [],
  MortgageSlice
> = (set) => ({
  mortgage: {
    ...intitialState,
    setMode: (mode) =>
      set(({ mortgage }) => ({ mortgage: { ...mortgage, ...mode } })),
  },
});
