import { StoreState } from "@/lib/store";
import { DialogContent } from "@/types";
import { StateCreator } from "zustand";

export interface DialogState {
  item?: DialogContent;
}

export interface DialogSlice {
  dialog: DialogState & {
    setDialogItem: (item?: DialogContent) => void;
  };
}

const intitialState: DialogState = {
  item: undefined,
};

export const createDialogSlice: StateCreator<
  StoreState,
  [],
  [],
  DialogSlice
> = (set) => ({
  dialog: {
    ...intitialState,
    setDialogItem: (item) =>
      set(({ dialog }) => ({ dialog: { ...dialog, item } })),
  },
});
