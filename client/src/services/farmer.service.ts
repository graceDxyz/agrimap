import { QUERY_FARMERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { farmersSchema } from "@/lib/validations/farmer";
import { Message } from "@/types";
import { CreateFarmerInput, Farmer } from "@/types/farmer.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetFarmers({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<Farmer[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_FARMERS_KEY],
    queryFn: async () => {
      const res = await api.get("/farmers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return farmersSchema.parse({ farmers: res.data }).farmers;
    },
    ...options,
  });
}

export async function createFarmer({
  token,
  data,
}: {
  token: string;
  data: CreateFarmerInput;
}) {
  return await api.post<Farmer>("/farmers", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateFarmer({
  token,
  id,
  data,
}: {
  token: string;
  id: string;
  data: CreateFarmerInput;
}) {
  return await api.put<Farmer>(`/farmers/${id}`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteFarmer({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  const res = await api.delete<Message>(`/farmers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
