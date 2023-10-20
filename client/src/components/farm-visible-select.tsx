import Select from "react-select";
import { create } from "zustand";

interface Option {
  label: string;
  value?: boolean;
}

interface BearState {
  value: Option;
  setValue: (value: Option) => void;
}

const options: Option[] = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Archived",
    value: true,
  },
  {
    label: "Unarchived",
    value: false,
  },
];

export const useFarmVisibleFilter = create<BearState>()((set) => ({
  value: options[2],
  setValue: (value) => set(() => ({ value })),
}));

function FarmVisibleSelect() {
  const { value, setValue } = useFarmVisibleFilter();

  return (
    <Select
      className="w-36"
      placeholder="Visibilty ..."
      options={options}
      defaultValue={value}
      value={value}
      onChange={(e) => setValue(e as Option)}
    />
  );
}

export default FarmVisibleSelect;
