import { QUERY_FARMS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { farmsSchema } from "@/lib/validations/farm";
import { Message } from "@/types";
import { CreateFarmInput, Farm } from "@/types/farm.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetFarms({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<Farm[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_FARMS_KEY],
    queryFn: async () => {
      const res = await api.get("/farms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return farmsSchema.parse({ farms: res.data }).farms;
    },
    ...options,
  });
}

export async function createFarm({
  token,
  data,
}: {
  token: string;
  data: CreateFarmInput;
}) {
  return await api.post<Farm>("/farms", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateFarm({
  token,
  id,
  data,
}: {
  token: string;
  id: string;
  data: CreateFarmInput;
}) {
  return await api.put<Farm>(`/farms/${id}`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteFarm({ token, id }: { token: string; id: string }) {
  const res = await api.delete<Message>(`/farms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
