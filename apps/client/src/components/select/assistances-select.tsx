import { Badge } from "@/components/ui/badge";
import { QUERY_ASSISTANCES_KEY } from "@/constant/query.constant";
import { useGetAssistances } from "@/services/disbursement.service";
import { useQueryClient } from "@tanstack/react-query";
import { ActionMeta, MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";

interface AssistanceOption {
  value: string;
  label: string;
}

interface Props {
  isDisabled?: boolean;
  value: string[];
  onChange: (
    newValue: MultiValue<AssistanceOption>,
    actionMeta: ActionMeta<AssistanceOption>,
  ) => void;
  onCreateOption: (inputValue: string) => void;
}

export function AssistanceSelect({
  isDisabled,
  value,
  onChange,
  onCreateOption,
}: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAssistances();

  const assistanceOptions: AssistanceOption[] =
    data?.map((crop) => ({ value: crop, label: crop })) ?? [];

  const filterAssistances = (inputValue: string) => {
    return assistanceOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<AssistanceOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterAssistances(inputValue));
      }, 500);
    });

  const selectedOptions = assistanceOptions.filter((item) =>
    value.includes(item.value),
  );

  function handleCreateOption(inputValue: string) {
    queryClient.setQueriesData<string[]>([QUERY_ASSISTANCES_KEY], (items) => {
      if (items) {
        return [...items, inputValue].sort();
      }
      return items;
    });
    onCreateOption(inputValue);
  }

  if (isDisabled) {
    return (
      <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
        {selectedOptions.map((item, index) => (
          <Badge
            variant="secondary"
            key={index}
            className="cursor-default capitalize"
          >
            {item.label}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <AsyncCreatableSelect
      isMulti
      isClearable={false}
      isLoading={isLoading}
      defaultOptions={assistanceOptions}
      loadOptions={promiseOptions}
      placeholder="Select assistance..."
      value={selectedOptions}
      onChange={onChange}
      onCreateOption={handleCreateOption}
      className="capitalize"
    />
  );
}
