import {
  QUERY_ACTIVE_USER_KEY,
  QUERY_ASSISTANCES_KEY,
  QUERY_DISBURSEMENTS_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ActiveUser,
  CreateDisbursementInput,
  Disbursement,
  disbursementsSchema,
} from "schema";

export async function fetchDisbursements(token: string) {
  const res = await api.get("/disbursements", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return disbursementsSchema.parse({ disbursements: res.data }).disbursements;
}

export const getDisbursementsQuery = (token: string) => ({
  queryKey: [QUERY_DISBURSEMENTS_KEY],
  queryFn: async () => await fetchDisbursements(token),
});

export function useGetDisbursements(
  options?: UseQueryOptions<Disbursement[], AxiosError>
) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);

  return useQuery({
    ...getDisbursementsQuery(user?.accessToken ?? ""),
    ...options,
  });
}

export const disbursementsLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getDisbursementsQuery(token);
    return (
      queryClient.getQueryData<Disbursement[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

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
    }
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
