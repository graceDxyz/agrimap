import { QUERY_USERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { LoaderType } from "@/types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Message } from "react-hook-form";
import { CreateUserInput, User, usersSchema } from "schema";

export async function fetchUsers() {
  const res = await api.get("/users");
  return usersSchema.parse({ users: res.data }).users;
}

export const getUsersQuery = () => ({
  queryKey: [QUERY_USERS_KEY],
  queryFn: async () => await fetchUsers(),
});

export function useGetUsers(options?: UseQueryOptions<User[], AxiosError>) {
  return useQuery({
    ...getUsersQuery(),
    ...options,
  });
}

export const usersLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getUsersQuery();
    return (
      queryClient.getQueryData<User[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export async function createUser(data: CreateUserInput) {
  return await api.post<User>("/users", JSON.stringify(data), {});
}

export async function updateUser({
  id,
  data,
}: {
  id: string;
  data: CreateUserInput;
}) {
  return await api.put<User>(`/users/${id}`, JSON.stringify(data), {});
}

export async function deleteUser(id: string) {
  const res = await api.delete<Message>(`/users/${id}`, {});

  return res;
}
