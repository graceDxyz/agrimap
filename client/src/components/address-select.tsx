import {
  barangayOptions,
  cityOptions,
  provinceOptions,
} from "@/services/address.service";
import { Barangay, City, Province } from "@/types/address.type";
import { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

interface Props<T> {
  value?: Partial<T> | Partial<T>[] | null;
  onChange?: (
    newValue: SingleValue<Partial<T>> | null,
    actionMeta: ActionMeta<Partial<T>>
  ) => void;
}

type GenericSelectProps<T> = Props<T> & {
  loadOptions: (inputValue: string, callback: (options: T[]) => void) => void;
};

function GenericSelect<T>({ loadOptions, ...props }: GenericSelectProps<T>) {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable
      loadOptions={loadOptions}
      {...props}
    />
  );
}

export const ProvinceSelect = (props: Props<Province>) => {
  return <GenericSelect<Province> loadOptions={provinceOptions} {...props} />;
};

export const CitySelect = (props: Props<City>) => {
  return <GenericSelect<City> loadOptions={cityOptions} {...props} />;
};

export const BarangaySelect = (props: Props<Barangay>) => {
  return <GenericSelect<Barangay> loadOptions={barangayOptions} {...props} />;
};
