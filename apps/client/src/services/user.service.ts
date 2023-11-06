import {
  QUERY_ACTIVE_USER_KEY,
  QUERY_USERS_KEY,
} from "@/constant/query.constant";
import api from "@/lib/api";
import { usersSchema } from "@/lib/validations/user";
import { LoaderType } from "@/types";
import { ActiveUser, CreateUserInput, User } from "@/types/user.type";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Message } from "react-hook-form";

export async function fetchUsers(token: string) {
  const res = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return usersSchema.parse({ users: res.data }).users;
}

export const getUsersQuery = (token: string) => ({
  queryKey: [QUERY_USERS_KEY],
  queryFn: async () => await fetchUsers(token),
});

export function useGetUsers(options?: UseQueryOptions<User[], AxiosError>) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ActiveUser>([QUERY_ACTIVE_USER_KEY]);
  return useQuery({
    ...getUsersQuery(user?.accessToken ?? ""),
    ...options,
  });
}

export const usersLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getUsersQuery(token);
    return (
      queryClient.getQueryData<User[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export async function createUser({
  token,
  data,
}: {
  token: string;
  data: CreateUserInput;
}) {
  return await api.post<User>("/users", JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateUser({
  token,
  id,
  data,
}: {
  token: string;
  id: string;
  data: CreateUserInput;
}) {
  return await api.put<User>(`/users/${id}`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteUser({ token, id }: { token: string; id: string }) {
  const res = await api.delete<Message>(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
}
