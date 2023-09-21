import {
  QUERY_MORTGAGE_KEY,
  QUERY_MORTGAGES_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { mortgageSchema, mortgagesSchema } from "@/lib/validations/mortgage";
import { Message } from "@/types";
import { CreateMortgageInput, Mortgage } from "@/types/mortgage.type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetMortgages({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<Mortgage[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_MORTGAGES_KEY],
    queryFn: async () => {
      const res = await api.get("/mortgages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return mortgagesSchema.parse({ mortgages: res.data }).mortgages;
    },
    ...options,
  });
}

export function useGetMortgage({
  token,
  mortgageId,
}: {
  token: string;
  mortgageId: string;
}) {
  return useQuery({
    queryKey: [QUERY_MORTGAGE_KEY, mortgageId],
    queryFn: async () => {
      const res = await api.get(`/mortgages/${mortgageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return mortgageSchema.parse(res.data);
    },
  });
}

export async function createMortgage({
  token,
  data,
}: {
  token: string;
  data: CreateMortgageInput;
}) {
  return await api.post<Mortgage>("/mortgages", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateMortgage({
  token,
  id,
  data,
}: {
  token: string;
  id: string;
  data: CreateMortgageInput;
}) {
  return await api.put<Mortgage>(`/mortgages/${id}`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteMortgage({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  const res = await api.delete<Message>(`/mortgages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
