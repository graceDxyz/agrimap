import { StateCreator } from "zustand";
import { StoreState } from ".";
import { Mode } from "@/types";
import { Farm } from "@/types/farm.type";

type FarmMode =
  | {
      mode: "update" | "delete";
      farm: Farm;
    }
  | {
      mode: "view" | "create";
      farm?: Farm;
    };

interface State {
  mode: Mode;
  farm?: Farm;
}

export interface FarmSlice {
  farm: State & {
    setMode: (mode: FarmMode) => void;
  };
}

const intitialState: State = {
  mode: "view",
  farm: undefined,
};

export const createFarmSlice: StateCreator<StoreState, [], [], FarmSlice> = (
  set,
) => ({
  farm: {
    ...intitialState,
    setMode: (mode) => set(({ farm }) => ({ farm: { ...farm, ...mode } })),
  },
});
