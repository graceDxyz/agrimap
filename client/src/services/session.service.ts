import { QUERY_USERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { activeUserSchema } from "@/lib/validations/user";
import { useQuery } from "@tanstack/react-query";

export function useGetSession() {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async () => {
      const res = await api.get("/sessions/current");

      if (res.data) {
        return activeUserSchema.parse(res.data);
      }
      return null;
    },
  });
}

export function useDeleteSession() {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async () => {
      const res = await api.get("/sessions/current");

      if (res.data) {
        return activeUserSchema.parse(res.data);
      }
      return null;
    },
  });
}
