import { QUERY_USERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { usersSchema } from "@/lib/validations/user";
import { User } from "@/types/user.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetUsers({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<User[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async () => {
      const res = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return usersSchema.parse({ users: res.data }).users;
    },
    ...options,
  });
}
