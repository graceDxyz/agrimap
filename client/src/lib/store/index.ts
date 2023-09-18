import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserSlice, createUserSlice } from "./userSlice";
import { FarmerSlice, createFarmerSlice } from "./farmerSlice";
import { FarmSlice, createFarmSlice } from "./farmSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<
  UserSlice | FarmerSlice | FarmSlice
>;

const useBoundStore = create<StoreState>()(
  devtools((...a) => ({
    ...createUserSlice(...a),
    ...createFarmerSlice(...a),
    ...createFarmSlice(...a),
  })),
);

export { useBoundStore };
