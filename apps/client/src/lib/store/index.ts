import { AuthSlice, createAuthSlice } from "@/lib/store/authSlice";
import { OverviewSlice, createSwitcherSlice } from "@/lib/store/overviewSlice";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { DialogSlice, createDialogSlice } from "./dialogSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<
  OverviewSlice | AuthSlice | DialogSlice
>;

const useBoundStore = create<StoreState>()(
  devtools((...a) => ({
    ...createSwitcherSlice(...a),
    ...createAuthSlice(...a),
    ...createDialogSlice(...a),
  })),
);

export { useBoundStore };
