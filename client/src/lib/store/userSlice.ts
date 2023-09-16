import { StateCreator } from "zustand";
import { StoreState } from ".";
import { User } from "@/types/user.type";
import { Mode } from "@/types";

type UserMode =
  | {
      mode: "update" | "delete";
      user: User;
    }
  | {
      mode: "view" | "create";
      user?: User;
    };

interface State {
  mode: Mode;
  user?: User;
}

export interface UserSlice {
  user: State & {
    setMode: (mode: UserMode) => void;
  };
}

const intitialState: State = {
  mode: "view",
  user: undefined,
};

export const createUserSlice: StateCreator<StoreState, [], [], UserSlice> = (
  set,
) => ({
  user: {
    ...intitialState,
    setMode: (mode) => set(({ user }) => ({ user: { ...user, ...mode } })),
  },
});
