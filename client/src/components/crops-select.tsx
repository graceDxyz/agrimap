import { QUERY_CROPS_KEY } from "@/constant/query.constant";
import { useGetFarmCrops } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { useQueryClient } from "@tanstack/react-query";
import { ActionMeta, MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";

interface CropOption {
  value: string;
  label: string;
}

interface Props {
  isDisabled?: boolean;
  value: string[];
  onChange: (
    newValue: MultiValue<CropOption>,
    actionMeta: ActionMeta<CropOption>
  ) => void;
  onCreateOption: (inputValue: string) => void;
}

export function CropSelect({
  isDisabled,
  value,
  onChange,
  onCreateOption,
}: Props) {
  const queryClient = useQueryClient();
  const { user } = useGetAuth();
  const { data, isLoading } = useGetFarmCrops({
    token: user?.accessToken ?? "",
  });

  const cropOptions: CropOption[] =
    data?.map((crop) => ({ value: crop, label: crop })) ?? [];

  const filterColors = (inputValue: string) => {
    return cropOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<CropOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 500);
    });

  const selectedOptions = cropOptions.filter((item) =>
    value.includes(item.value)
  );

  function handleCreateOption(inputValue: string) {
    queryClient.setQueriesData<string[]>([QUERY_CROPS_KEY], (items) => {
      if (items) {
        return [...items, inputValue].sort();
      }
      return items;
    });
    onCreateOption(inputValue);
  }

  return (
    <AsyncCreatableSelect
      isMulti
      isDisabled={isDisabled}
      isLoading={isLoading}
      defaultOptions={cropOptions}
      loadOptions={promiseOptions}
      placeholder="Select crops..."
      value={selectedOptions}
      onChange={onChange}
      onCreateOption={handleCreateOption}
    />
  );
}
