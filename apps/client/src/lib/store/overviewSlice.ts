import { StatsBy, SwitcherType } from "schema";
import { StateCreator } from "zustand";
import { StoreState } from ".";

interface State {
  activeSwitcher: SwitcherType;
  options: SwitcherType[];
}

export interface OverviewSlice {
  overview: State & {
    setSwitcherValue: (activeSwitcher: SwitcherType) => void;
  };
}
const options = Object.values(StatsBy).map((value) => ({
  label: value,
  value: value,
}));

const intitialState: State = {
  activeSwitcher: options[2],
  options: options,
};

export const createSwitcherSlice: StateCreator<
  StoreState,
  [],
  [],
  OverviewSlice
> = (set) => ({
  overview: {
    ...intitialState,
    setSwitcherValue: (activeSwitcher) =>
      set(({ overview: switcher }) => ({
        overview: { ...switcher, activeSwitcher },
      })),
  },
});
