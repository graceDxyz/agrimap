import { useGetPhAddress } from "@/services/address.service";
import { Barangay, City, Province } from "@/types/address.type";
import { useEffect } from "react";
import { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { create } from "zustand";
import { Input } from "./ui/input";

interface Props<T> {
  isDisabled?: boolean;
  isLoading?: boolean;
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
  isDisabled,
  isLoading,
  loadOptions,
  ...props
}: GenericSelectProps<T>) {
  const value = props?.value as unknown as { label?: string | null };

  return isDisabled ? (
    <Input
      className="disabled:opacity-100"
      disabled
      value={value?.label ?? ""}
    />
  ) : (
    <AsyncSelect
      cacheOptions
      isClearable
      isLoading={isLoading}
      isDisabled={isDisabled}
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      {...props}
    />
  );
}

interface AddressState {
  prov?: string;
  city?: string;
  setAddressState: (props: { prov?: string; city?: string }) => void;
  resetState: () => void;
}

export const useAddressState = create<AddressState>()((set) => ({
  prov: undefined,
  city: undefined,
  setAddressState: (props) => set(() => ({ ...props })),
  resetState: () => set(() => ({ prov: undefined, city: undefined })),
}));

const useGetOptions = () => {
  const { prov, city } = useAddressState();
  const { data, isLoading } = useGetPhAddress();
  const { provinces = [], cities = [], barangays = [] } = data || {};

  const fileredProvinces = provinces.filter((item) =>
    prov ? item.psgcCode === prov : true
  );

  const filteredCities = cities.filter((item) => {
    const provinceFilter = prov ? item.provinceCode === prov : true;
    const cityFilter = city ? item.psgcCode === city : true;
    return provinceFilter && cityFilter;
  });

  const filteredBarangays = barangays.filter((item) => {
    const cityFilter = city ? item.cityMunCode === city : true;
    const provinceFilter = prov ? item.provinceCode === prov : true;
    return cityFilter && provinceFilter;
  });

  const limitedProvinces = fileredProvinces.slice(0, 100);
  const limitedCities = filteredCities.slice(0, 100);
  const limitedBarangays = filteredBarangays.slice(0, 100);

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
    isLoading,
    barangays,
    defaultBrgyOptions: limitedBarangays,
    promiseBrgyOptions: (inputValue: string) =>
      promiseOptions(inputValue, filteredBarangays),
    cities,
    defaultCityOptions: limitedCities,
    promiseCityOptions: (inputValue: string) =>
      promiseOptions(inputValue, filteredCities),
    defaultProvOptions: limitedProvinces,
    provinces,
    promiseProvOptions: (inputValue: string) =>
      promiseOptions(inputValue, fileredProvinces),
  };
};

export const ProvinceSelect = (props: Props<Province>) => {
  const { setAddressState, prov } = useAddressState();
  const { defaultProvOptions, promiseProvOptions, provinces, isLoading } =
    useGetOptions();

  const propsValue = props.value as { label?: string };
  const selectedItem = provinces.find((item) => {
    const provFilter = prov ? item.psgcCode === prov : true;
    return item.label === propsValue?.label && provFilter;
  });

  useEffect(() => {
    setAddressState({ prov: selectedItem?.psgcCode });
  }, [selectedItem]);

  return (
    <GenericSelect<Province>
      isLoading={isLoading}
      defaultOptions={defaultProvOptions}
      loadOptions={promiseProvOptions}
      {...props}
    />
  );
};

export const CitySelect = (props: Props<City>) => {
  const { setAddressState, prov } = useAddressState();
  const { defaultCityOptions, promiseCityOptions, cities, isLoading } =
    useGetOptions();

  const propsValue = props.value as { label?: string };
  const selectedItem = cities.find((item) => {
    const provFilter = prov ? item.provinceCode === prov : true;
    return item.label === propsValue?.label && provFilter;
  });

  useEffect(() => {
    setAddressState({
      city: selectedItem?.psgcCode,
      prov: prov ? prov : selectedItem?.provinceCode,
    });
  }, [selectedItem]);

  return (
    <GenericSelect<City>
      isLoading={isLoading}
      defaultOptions={defaultCityOptions}
      loadOptions={promiseCityOptions}
      {...props}
    />
  );
};

export const BarangaySelect = (props: Props<Barangay>) => {
  const { setAddressState, city, prov } = useAddressState();
  const { defaultBrgyOptions, promiseBrgyOptions, barangays, isLoading } =
    useGetOptions();

  const propsValue = props.value as { label?: string };
  const selectedItem = barangays.find((item) => {
    const cityFilter = city ? item.cityMunCode === city : true;
    const provFilter = prov ? item.provinceCode === prov : true;
    return item.label === propsValue?.label && cityFilter && provFilter;
  });

  useEffect(() => {
    setAddressState({
      city: city ? city : selectedItem?.cityMunCode,
      prov: prov ? prov : selectedItem?.provinceCode,
    });
  }, [selectedItem]);

  return (
    <GenericSelect<Barangay>
      isLoading={isLoading}
      defaultOptions={defaultBrgyOptions}
      loadOptions={promiseBrgyOptions}
      {...props}
    />
  );
};
