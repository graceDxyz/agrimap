import {
  QUERY_MORTGAGE_KEY,
  QUERY_MORTGAGES_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  CreateMortgageInput,
  Mortgage,
  mortgageSchema,
  mortgagesSchema,
} from "schema";

export async function fetchMortgages() {
  const res = await api.get("/mortgages");
  return mortgagesSchema.parse({ mortgages: res.data }).mortgages;
}

export const getMortgagesQuery = () => ({
  queryKey: [QUERY_MORTGAGES_KEY],
  queryFn: async () => await fetchMortgages(),
});

export function useGetMortgages(
  options?: UseQueryOptions<Mortgage[], AxiosError>,
) {
  return useQuery({
    ...getMortgagesQuery(),
    ...options,
  });
}

export const getMortgageQuery = ({ mortgageId }: { mortgageId: string }) => ({
  queryKey: [QUERY_MORTGAGE_KEY, mortgageId],
  queryFn: async () => {
    const res = await api.get(`/mortgages/${mortgageId}`);

    return mortgageSchema.parse(res.data);
  },
});

export function useGetMortgage(
  mortgageId: string,
  options?: UseQueryOptions<Mortgage, AxiosError>,
) {
  return useQuery({
    ...getMortgageQuery({ mortgageId }),
    ...options,
  });
}

export const mortgagesLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getMortgagesQuery();
    return (
      queryClient.getQueryData<Mortgage[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const mortgageLoader =
  ({ queryClient }: LoaderType) =>
  async ({ params }: LoaderFunctionArgs) => {
    const mortgageId = params.mortgageId ?? "";
    const query = getMortgageQuery({ mortgageId });
    const mortgage =
      queryClient.getQueryData<Mortgage>(query.queryKey) ??
      (await queryClient.fetchQuery(query));
    return mortgage;
  };

export async function createMortgage(data: CreateMortgageInput) {
  return await api.post<Mortgage>("/mortgages", JSON.stringify(data), {});
}

export async function updateMortgage({
  id,
  data,
}: {
  id: string;
  data: CreateMortgageInput;
}) {
  return await api.put<Mortgage>(`/mortgages/${id}`, JSON.stringify(data), {});
}

export async function deleteMortgage(id: string) {
  const res = await api.delete<Message>(`/mortgages/${id}`, {});

  return res;
}
