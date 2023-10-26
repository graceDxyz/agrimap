import { Badge } from "@/components/ui/badge";
import { useGetFarmers } from "@/services/farmer.service";
import { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

interface FarmerOption {
  value: string;
  label: string;
}

interface Props {
  isDisabled?: boolean;
  value: string;
  onChange: (
    newValue: SingleValue<FarmerOption>,
    actionMeta: ActionMeta<FarmerOption>,
  ) => void;
}

export function FarmerSelect({ isDisabled, value, onChange }: Props) {
  const { data, isLoading } = useGetFarmers({});

  const farmerOptions: FarmerOption[] =
    data?.map((farmer) => ({ value: farmer._id, label: farmer.fullName })) ??
    [];

  const filterFarmers = (inputValue: string) => {
    return farmerOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<FarmerOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterFarmers(inputValue));
      }, 500);
    });

  const selectedOptions = farmerOptions.find((item) => value === item.value);

  if (isDisabled) {
    return (
      <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
        <Badge variant="secondary" className="cursor-default capitalize">
          {selectedOptions?.label}
        </Badge>
      </div>
    );
  }

  return (
    <AsyncSelect
      isClearable={false}
      isLoading={isLoading}
      defaultOptions={farmerOptions}
      loadOptions={promiseOptions}
      placeholder="Select farmer..."
      value={selectedOptions}
      onChange={onChange}
      className="capitalize"
    />
  );
}
