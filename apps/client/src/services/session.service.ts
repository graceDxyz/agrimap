import { QUERY_ACTIVE_USER_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActiveUser, activeUserSchema } from "schema";

function logoutMutation(accessToken: string) {
  return api.post(
    "/sessions/current",
    {},
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function useGetSession() {
  return useQuery({
    queryKey: [QUERY_ACTIVE_USER_KEY],
    queryFn: async () => {
      const res = await api.get("/sessions/current");

      if (res.data) {
        return activeUserSchema.parse(res.data);
      }
      return null;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetAuth() {
  const queryClient = useQueryClient();
  const user = useQuery<ActiveUser>([QUERY_ACTIVE_USER_KEY], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }).data;

  const { mutate } = useMutation({
    mutationFn: logoutMutation,
    onMutate: () => {
      queryClient.setQueryData([QUERY_ACTIVE_USER_KEY], null);
    },
  });

  const logout = () => mutate(user?.accessToken ?? "");

  return {
    user,
    logout,
  };
}
