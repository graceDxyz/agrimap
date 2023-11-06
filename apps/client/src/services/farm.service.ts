import {
  QUERY_ACTIVE_USER_KEY,
  QUERY_CROPS_KEY,
  QUERY_FARMS_KEY,
  QUERY_FARM_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType, Message } from "@/types";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  ActiveUser,
  CreateFarmInput,
  Farm,
  farmSchema,
  farmsSchema,
} from "schema";

export async function fetchFarms(token: string) {
  const res = await api.get("/farms", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return farmsSchema.parse({ farms: res.data }).farms;
}

export const getFarmsQuery = (token: string) => ({
  queryKey: [QUERY_FARMS_KEY],
  queryFn: async () => await fetchFarms(token),
});

export function useGetFarms(options?: UseQueryOptions<Farm[], AxiosError>) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);
  return useQuery({
    ...getFarmsQuery(user?.accessToken ?? ""),
    ...options,
  });
}

export const getFarmQuery = ({
  token,
  farmId,
}: {
  token: string;
  farmId: string;
}) => ({
  queryKey: [QUERY_FARM_KEY, farmId],
  queryFn: async () => {
    const res = await api.get(`/farms/${farmId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return farmSchema.parse(res.data);
  },
});

export function useGetFarm(farmId: string) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);

  return useQuery({
    ...getFarmQuery({ token: user?.accessToken ?? "", farmId }),
  });
}

export const farmsLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getFarmsQuery(token);
    return (
      queryClient.getQueryData<Farm[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmLoader =
  ({ token, queryClient }: LoaderType) =>
  async ({ params }: LoaderFunctionArgs) => {
    const farmId = params.farmId ?? "";
    const query = getFarmQuery({ token, farmId });
    const farm =
      queryClient.getQueryData<Farm>(query.queryKey) ??
      (await queryClient.fetchQuery(query));
    return farm;
  };

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

export async function archivedFarm({
  token,
  id,
}: {
  token: string;
  id: string;
}) {
  const res = await api.post<Farm>(
    `/farms/${id}/archived`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
}

export function useGetFarmCrops({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<string[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_CROPS_KEY],
    queryFn: async () => {
      const res = await api.get("/farms/crops", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    ...options,
  });
}
