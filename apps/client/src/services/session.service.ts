import { QUERY_ACTIVE_USER_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { useBoundStore } from "@/lib/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activeUserSchema } from "schema";

const auth = useBoundStore.getState().auth;

export function useGetSession() {
  return useQuery({
    queryKey: [QUERY_ACTIVE_USER_KEY],
    queryFn: async () => {
      const res = await api.get("/sessions/current");
      if (res.data) {
        const activeUser = activeUserSchema.parse(res.data);
        auth.setAuthUser(activeUser);
        return activeUser;
      }
      return null;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useLogOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return api.post("/sessions/current", {});
    },
    onMutate: () => {
      queryClient.setQueryData([QUERY_ACTIVE_USER_KEY], null);
    },
    onSettled: () => {
      auth.resetState();
    },
  });
}
