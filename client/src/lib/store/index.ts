import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FarmSlice, createFarmSlice } from "./farmSlice";
import { FarmerSlice, createFarmerSlice } from "./farmerSlice";
import { MortgageSlice, createMortgageSlice } from "./mortgageSlice";
import { OverviewSlice, createSwitcherSlice } from "./overviewSlice";
import { UserSlice, createUserSlice } from "./userSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<
  UserSlice | FarmerSlice | FarmSlice | MortgageSlice | OverviewSlice
>;

const useBoundStore = create<StoreState>()(
  devtools((...a) => ({
    ...createUserSlice(...a),
    ...createFarmerSlice(...a),
    ...createFarmSlice(...a),
    ...createMortgageSlice(...a),
    ...createSwitcherSlice(...a),
  }))
);

export { useBoundStore };
