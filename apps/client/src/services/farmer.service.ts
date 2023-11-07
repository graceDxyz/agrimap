import { QUERY_FARMERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateFarmerInput, Farmer, farmersSchema } from "schema";

export async function fetchFarmers() {
  const res = await api.get("/farmers");
  return farmersSchema.parse({ farmers: res.data }).farmers;
}

export const getFarmersQuery = () => ({
  queryKey: [QUERY_FARMERS_KEY],
  queryFn: async () => await fetchFarmers(),
});

export function useGetFarmers(options?: UseQueryOptions<Farmer[], AxiosError>) {
  return useQuery({
    ...getFarmersQuery(),
    ...options,
  });
}

export const farmersLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getFarmersQuery();
    return (
      queryClient.getQueryData<Farmer[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export async function createFarmer(data: CreateFarmerInput) {
  return await api.post<Farmer>("/farmers", JSON.stringify(data), {});
}

export async function updateFarmer({
  id,
  data,
}: {
  id: string;
  data: CreateFarmerInput;
}) {
  return await api.put<Farmer>(`/farmers/${id}`, JSON.stringify(data), {});
}

export async function deleteFarmer(id: string) {
  const res = await api.delete<Message>(`/farmers/${id}`, {});

  return res;
}
