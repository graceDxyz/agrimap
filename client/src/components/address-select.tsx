import { useGetPhAddress } from "@/services/address.service";
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
  defaultOptions?: T[];
  loadOptions: (inputValue: string, callback: (options: T[]) => void) => void;
};

function GenericSelect<T>({
  defaultOptions,
  loadOptions,
  ...props
}: GenericSelectProps<T>) {
  return (
    <AsyncSelect
      cacheOptions
      isClearable
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      {...props}
    />
  );
}

const useGetOptions = () => {
  const { data } = useGetPhAddress();
  const { provinces = [], cities = [], barangays = [] } = data || {};
  const limitedProvinces = provinces.slice(0, 100);
  const limitedCities = cities.slice(0, 100);
  const limitedBarangays = barangays.slice(0, 100);

  const promiseOptions = (inputValue: string, data: any[]) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(
          data
            .filter((item) =>
              item.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 100)
        );
      }, 500);
    });

  return {
    defaultBrgyOptions: limitedBarangays,
    promiseBrgyOptions: (inputValue: string) =>
      promiseOptions(inputValue, barangays),
    defaultCityOptions: limitedCities,
    promiseCityOptions: (inputValue: string) =>
      promiseOptions(inputValue, cities),
    defaultProvOptions: limitedProvinces,
    promiseProvOptions: (inputValue: string) =>
      promiseOptions(inputValue, provinces),
  };
};

export const ProvinceSelect = (props: Props<Province>) => {
  const { defaultProvOptions, promiseProvOptions } = useGetOptions();
  return (
    <GenericSelect<Province>
      defaultOptions={defaultProvOptions}
      loadOptions={promiseProvOptions}
      {...props}
    />
  );
};

export const CitySelect = (props: Props<City>) => {
  const { defaultCityOptions, promiseCityOptions } = useGetOptions();

  return (
    <GenericSelect<City>
      defaultOptions={defaultCityOptions}
      loadOptions={promiseCityOptions}
      {...props}
    />
  );
};

export const BarangaySelect = (props: Props<Barangay>) => {
  const { defaultBrgyOptions, promiseBrgyOptions } = useGetOptions();

  return (
    <GenericSelect<Barangay>
      defaultOptions={defaultBrgyOptions}
      loadOptions={promiseBrgyOptions}
      {...props}
    />
  );
};
