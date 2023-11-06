import {
  QUERY_ACTIVE_USER_KEY,
  QUERY_MORTGAGE_KEY,
  QUERY_MORTGAGES_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ActiveUser,
  CreateMortgageInput,
  Mortgage,
  mortgageSchema,
  mortgagesSchema,
} from "schema";

export async function fetchMortgages(token: string) {
  const res = await api.get("/mortgages", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return mortgagesSchema.parse({ mortgages: res.data }).mortgages;
}

export const getMortgagesQuery = (token: string) => ({
  queryKey: [QUERY_MORTGAGES_KEY],
  queryFn: async () => await fetchMortgages(token),
});

export function useGetMortgages(
  options?: UseQueryOptions<Mortgage[], AxiosError>
) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);

  return useQuery({
    ...getMortgagesQuery(user?.accessToken ?? ""),
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

export const mortgagesLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getMortgagesQuery(token);
    return (
      queryClient.getQueryData<Mortgage[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

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
