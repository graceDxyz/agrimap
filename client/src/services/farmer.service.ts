import {
  QUERY_ACTIVE_USER_KEY,
  QUERY_FARMERS_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { farmersSchema } from "@/lib/validations/farmer";
import { LoaderType, Message } from "@/types";
import { CreateFarmerInput, Farmer } from "@/types/farmer.type";
import { ActiveUser } from "@/types/user.type";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export async function fetchFarmers(token: string) {
  const res = await api.get("/farmers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return farmersSchema.parse({ farmers: res.data }).farmers;
}

export const getFarmersQuery = (token: string) => ({
  queryKey: [QUERY_FARMERS_KEY],
  queryFn: async () => await fetchFarmers(token),
});

export function useGetFarmers(options?: UseQueryOptions<Farmer[], AxiosError>) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);
  return useQuery({
    ...getFarmersQuery(user?.accessToken ?? ""),
    ...options,
  });
}

export const farmersLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getFarmersQuery(token);
    return (
      queryClient.getQueryData<Farmer[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

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
