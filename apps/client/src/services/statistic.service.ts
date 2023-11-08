import { QUERY_STATISTICS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType } from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  RecentAdded,
  StatCount,
  StatsQuery,
  recentAddedSchema,
  statCountSchema,
} from "schema";
import { farmsLoader } from "./farm.service";
import { farmersLoader } from "./farmer.service";

export const mapLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const farmerRes = farmersLoader({ queryClient });
    const farmRes = farmsLoader({ queryClient });

    const [farmers, farms] = await Promise.all([farmerRes(), farmRes()]);

    return {
      farmers,
      farms,
    };
  };

export function useGetRecentAdded(
  options?: UseQueryOptions<RecentAdded, AxiosError>,
) {
  return useQuery({
    queryKey: [QUERY_STATISTICS_KEY, "recent"],
    queryFn: async () => {
      const res = await api.get("/statistics/recent");

      return recentAddedSchema.parse(res.data);
    },
    ...options,
  });
}

export function useGetStatistics({
  query,
  options,
}: {
  query: StatsQuery;
  options?: UseQueryOptions<any, AxiosError>;
}) {
  const queryString = new URLSearchParams(query as any).toString();

  const queryKey: (string | number)[] = [QUERY_STATISTICS_KEY];

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const value = query[key as keyof StatsQuery];
      if (value !== undefined) {
        queryKey.push(value);
      }
    }
  }
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await api.get(`/statistics?${queryString}`);

      return res.data;
    },
    ...options,
  });
}

export function useGetStatCount(
  options?: UseQueryOptions<StatCount, AxiosError>,
) {
  return useQuery({
    queryKey: [QUERY_STATISTICS_KEY, "count"],
    queryFn: async () => {
      const res = await api.get("/statistics/count");

      return statCountSchema.parse(res.data);
    },
    ...options,
  });
}
