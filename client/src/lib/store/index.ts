import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserSlice, createUserSlice } from "./userSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<UserSlice>;

const useBoundStore = create<StoreState>()(
  devtools((...a) => ({
    ...createUserSlice(...a),
  })),
);

export { useBoundStore };
