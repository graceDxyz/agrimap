import { StoreState } from "@/lib/store";
import { User } from "schema";
import { StateCreator } from "zustand";

export interface AuthState {
  accessToken?: string;
  user?: User;
}

export interface AuthSlice {
  auth: AuthState & {
    setAuthUser: (state: AuthState) => void;
    resetState: () => void;
  };
}

const intitialState: AuthState = {
  accessToken: undefined,
  user: undefined,
};

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
) => ({
  auth: {
    ...intitialState,
    setAuthUser: (state) =>
      set(({ auth }) => ({ auth: { ...auth, ...state } })),
    resetState: () =>
      set(({ auth }) => ({ auth: { ...auth, ...intitialState } })),
  },
});
