import { AuthSlice, createAuthSlice } from "@/lib/store/authSlice";
import {
  DisbursementSlice,
  createDisbursementSlice,
} from "@/lib/store/disbursementSlice";
import { FarmSlice, createFarmSlice } from "@/lib/store/farmSlice";
import { FarmerSlice, createFarmerSlice } from "@/lib/store/farmerSlice";
import { MortgageSlice, createMortgageSlice } from "@/lib/store/mortgageSlice";
import { OverviewSlice, createSwitcherSlice } from "@/lib/store/overviewSlice";
import { UserSlice, createUserSlice } from "@/lib/store/userSlice";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<
  | UserSlice
  | FarmerSlice
  | FarmSlice
  | MortgageSlice
  | OverviewSlice
  | DisbursementSlice
  | AuthSlice
>;

const useBoundStore = create<StoreState>()(
  devtools((...a) => ({
    ...createUserSlice(...a),
    ...createFarmerSlice(...a),
    ...createFarmSlice(...a),
    ...createMortgageSlice(...a),
    ...createSwitcherSlice(...a),
    ...createDisbursementSlice(...a),
    ...createAuthSlice(...a),
  }))
);

export { useBoundStore };
