import { QUERY_ADDRESSES_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PhAddress, phAddressSchema } from "schema";

export async function fetchAddress() {
  const res = await api.get("/address");

  return phAddressSchema.parse(res.data);
}

export function useGetPhAddress(
  options?: UseQueryOptions<PhAddress, AxiosError>,
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
