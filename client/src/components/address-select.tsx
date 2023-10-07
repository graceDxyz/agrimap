import {
  barangayOptions,
  cityOptions,
  regionOptions,
} from "@/services/address.service";
import AsyncSelect from "react-select/async";

export function RegionSelect() {
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={regionOptions}
      isClearable
    />
  );
}

export function CitySelect() {
  return <AsyncSelect cacheOptions defaultOptions loadOptions={cityOptions} />;
}

export function BarangaySelect() {
  return (
    <AsyncSelect cacheOptions defaultOptions loadOptions={barangayOptions} />
  );
}
