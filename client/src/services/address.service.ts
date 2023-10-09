import { QUERY_ADDRESSES_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { phAddressSchema } from "@/lib/validations/address";
import { Barangay, City, PhAddress, Province } from "@/types/address.type";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

let regionTimeout: NodeJS.Timeout | null = null;
let cityTimeout: NodeJS.Timeout | null = null;
let barangayTimeout: NodeJS.Timeout | null = null;
const timeOut = 500;

export const provinceOptions = (inputValue: string): Promise<Province[]> => {
  if (regionTimeout) {
    clearTimeout(regionTimeout);
  }

  return new Promise((resolve) => {
    regionTimeout = setTimeout(() => {
      api
        .get<Province[]>(`/address/province?filter=${inputValue}`)
        .then((res) => resolve(res.data));
    }, timeOut);
  });
};

export const cityOptions = async (inputValue: string): Promise<City[]> => {
  if (cityTimeout) {
    clearTimeout(cityTimeout);
  }

  return new Promise((resolve) => {
    cityTimeout = setTimeout(async () => {
      const response = await api.get<City[]>(
        `/address/city?filter=${inputValue}`
      );
      resolve(response.data);
    }, timeOut);
  });
};

export const barangayOptions = async (
  inputValue: string
): Promise<Barangay[]> => {
  if (barangayTimeout) {
    clearTimeout(barangayTimeout);
  }

  return new Promise((resolve) => {
    barangayTimeout = setTimeout(async () => {
      const response = await api.get<Barangay[]>(
        `/address/barangay?filter=${inputValue}`
      );
      resolve(response.data);
    }, timeOut);
  });
};

export async function fetchAddress() {
  const res = await api.get("/address");

  return phAddressSchema.parse(res.data);
}

export async function useGetPhAddress(
  options?: UseQueryOptions<PhAddress, AxiosError>
) {
  return useQuery({
    queryKey: [QUERY_ADDRESSES_KEY],
    queryFn: fetchAddress,
    ...options,
  });
}

export async function prefetchPhAddress() {
  const queryClient = useQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_ADDRESSES_KEY],
    queryFn: fetchAddress,
  });
}
