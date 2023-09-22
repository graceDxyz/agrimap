import { QUERY_STATISTICS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { recentAddedSchema } from "@/lib/validations/statistic";
import { RecentAdded } from "@/types/statistic.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetRecentAdded({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<RecentAdded, AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_STATISTICS_KEY, "recent_added"],
    queryFn: async () => {
      const res = await api.get("/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return recentAddedSchema.parse(res.data);
    },
    ...options,
  });
}
