import {
  QUERY_CROPS_KEY,
  QUERY_FARMS_KEY,
  QUERY_FARM_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderFunctionArgs } from "react-router-dom";
import { CreateFarmInput, Farm, farmSchema, farmsSchema } from "schema";

export async function fetchFarms() {
  const res = await api.get("/farms");
  return farmsSchema.parse({ farms: res.data }).farms;
}

export const getFarmsQuery = () => ({
  queryKey: [QUERY_FARMS_KEY],
  queryFn: async () => await fetchFarms(),
});

export function useGetFarms(options?: UseQueryOptions<Farm[], AxiosError>) {
  return useQuery({
    ...getFarmsQuery(),
    ...options,
  });
}

export const getFarmQuery = ({ farmId }: { farmId: string }) => ({
  queryKey: [QUERY_FARM_KEY, farmId],
  queryFn: async () => {
    const res = await api.get(`/farms/${farmId}`);

    return farmSchema.parse(res.data);
  },
});

export function useGetFarm(farmId: string) {
  return useQuery({
    ...getFarmQuery({ farmId }),
  });
}

export const farmsLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getFarmsQuery();
    return (
      queryClient.getQueryData<Farm[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmLoader =
  ({ queryClient }: LoaderType) =>
  async ({ params }: LoaderFunctionArgs) => {
    const farmId = params.farmId ?? "";
    const query = getFarmQuery({ farmId });
    const farm =
      queryClient.getQueryData<Farm>(query.queryKey) ??
      (await queryClient.fetchQuery(query));
    return farm;
  };

export async function createFarm(data: CreateFarmInput) {
  return await api.post<Farm>("/farms", JSON.stringify(data), {});
}

export async function updateFarm({
  id,
  data,
}: {
  id: string;
  data: CreateFarmInput;
}) {
  return await api.put<Farm>(`/farms/${id}`, JSON.stringify(data), {});
}

export async function deleteFarm(id: string) {
  const res = await api.delete<Message>(`/farms/${id}`, {});

  return res;
}

export async function archivedFarm(id: string) {
  const res = await api.post<Farm>(`/farms/${id}/archived`, {}, {});

  return res;
}

export function useGetFarmCrops(
  options?: UseQueryOptions<string[], AxiosError>
) {
  return useQuery({
    queryKey: [QUERY_CROPS_KEY],
    queryFn: async () => {
      const res = await api.get("/farms/crops");
      return res.data;
    },
    ...options,
  });
}
