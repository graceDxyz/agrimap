import { QUERY_ADDRESSES_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { phAddressSchema } from "@/lib/validations/address";
import { Barangay, City, PhAddress, Province } from "@/types/address.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const regionOptions = async (inputValue: string) => {
  const response = await api.get(`/address/province?filter=${inputValue}`);
  const data: Province[] = response.data;
  return data;
};

export const cityOptions = async (inputValue: string) => {
  const response = await api.get(`/address/city?filter=${inputValue}`);
  const data: City[] = response.data;
  return data;
};

export const barangayOptions = async (inputValue: string) => {
  const response = await api.get(`/address/barangay?filter=${inputValue}`);
  const data: Barangay[] = response.data;
  return data;
};

export function useGetPhAddress(
  options?: UseQueryOptions<PhAddress, AxiosError>
) {
  return useQuery({
    queryKey: [QUERY_ADDRESSES_KEY],
    queryFn: async () => {
      const res = await api.get("/address");

      return phAddressSchema.parse(res.data);
    },
    ...options,
  });
}
