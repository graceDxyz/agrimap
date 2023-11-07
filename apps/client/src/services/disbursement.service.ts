import {
  QUERY_ASSISTANCES_KEY,
  QUERY_DISBURSEMENTS_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CreateDisbursementInput,
  Disbursement,
  disbursementsSchema,
} from "schema";

export async function fetchDisbursements() {
  const res = await api.get("/disbursements");

  return disbursementsSchema.parse({ disbursements: res.data }).disbursements;
}

export const getDisbursementsQuery = () => ({
  queryKey: [QUERY_DISBURSEMENTS_KEY],
  queryFn: async () => await fetchDisbursements(),
});

export function useGetDisbursements(
  options?: UseQueryOptions<Disbursement[], AxiosError>
) {
  return useQuery({
    ...getDisbursementsQuery(),
    ...options,
  });
}

export const disbursementsLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getDisbursementsQuery();
    return (
      queryClient.getQueryData<Disbursement[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export async function createDisbursement(data: CreateDisbursementInput) {
  return await api.post<Disbursement>(
    "/disbursements",
    JSON.stringify(data),
    {}
  );
}

export async function updateDisbursement({
  id,
  data,
}: {
  id: string;
  data: CreateDisbursementInput;
}) {
  return await api.put<Disbursement>(
    `/disbursements/${id}`,
    JSON.stringify(data),
    {}
  );
}

export async function deleteDisbursement(id: string) {
  const res = await api.delete<Message>(`/disbursements/${id}`, {});

  return res;
}

export function useGetAssistances(
  options?: UseQueryOptions<string[], AxiosError>
) {
  return useQuery({
    queryKey: [QUERY_ASSISTANCES_KEY],
    queryFn: async () => {
      const res = await api.get("/disbursements/assistances");
      return res.data;
    },
    ...options,
  });
}
