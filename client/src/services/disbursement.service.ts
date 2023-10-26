import {
  QUERY_ASSISTANCES_KEY,
  QUERY_DISBURSEMENTS_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { disbursementsSchema } from "@/lib/validations/disbursement";
import { Message } from "@/types";
import {
  CreateDisbursementInput,
  Disbursement,
} from "@/types/disbursement.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetDisbursements({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<Disbursement[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_DISBURSEMENTS_KEY],
    queryFn: async () => {
      const res = await api.get("/disbursements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return disbursementsSchema.parse({ disbursements: res.data })
        .disbursements;
    },
    ...options,
  });
}

export async function createDisbursement({
  token,
  data,
}: {
  token: string;
  data: CreateDisbursementInput;
}) {
  return await api.post<Disbursement>("/disbursements", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateDisbursement({
  token,
  id,
  data,
}: {
  token: string;
  id: string;
  data: CreateDisbursementInput;
}) {
  return await api.put<Disbursement>(
    `/disbursements/${id}`,
    JSON.stringify(data),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function deleteDisbursement({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  const res = await api.delete<Message>(`/disbursements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}

export function useGetAssistances({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<string[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_ASSISTANCES_KEY],
    queryFn: async () => {
      const res = await api.get("/disbursements/assistances", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    ...options,
  });
}
