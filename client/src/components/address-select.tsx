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

export const ProvinceSelect = (props: Props<Province>) => {
  const { data } = useGetPhAddress();
  const items = data?.provinces ?? [];
  const defaultOptions = items;

  const filterData = (inputValue: string) => {
    return items
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 100);
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<Province[]>((resolve) => {
      setTimeout(() => {
        resolve(filterData(inputValue));
      }, 500);
    });

  return (
    <GenericSelect<Province>
      defaultOptions={defaultOptions}
      loadOptions={promiseOptions}
      {...props}
    />
  );
};

export const CitySelect = (props: Props<City>) => {
  const { data } = useGetPhAddress();
  const items = data?.cities ?? [];
  const defaultOptions = items.slice(0, 100);

  const filterData = (inputValue: string) => {
    return items
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 100);
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<Province[]>((resolve) => {
      setTimeout(() => {
        resolve(filterData(inputValue));
      }, 500);
    });

  return (
    <GenericSelect<City>
      defaultOptions={defaultOptions}
      loadOptions={promiseOptions}
      {...props}
    />
  );
};

export const BarangaySelect = (props: Props<Barangay>) => {
  const { data } = useGetPhAddress();
  const items = data?.barangays ?? [];
  const defaultOptions = items.slice(0, 100);

  const filterData = (inputValue: string) => {
    return items
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 100);
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<Province[]>((resolve) => {
      setTimeout(() => {
        resolve(filterData(inputValue));
      }, 500);
    });

  return (
    <GenericSelect<Barangay>
      defaultOptions={defaultOptions}
      loadOptions={promiseOptions}
      {...props}
    />
  );
};
