import { QUERY_USERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { usersSchema } from "@/lib/validations/user";
import { CreateInputs, User } from "@/types/user.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Message } from "react-hook-form";

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

export async function createUser({
  token,
  data,
}: {
  token: string;
  data: CreateInputs;
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
  data: CreateInputs;
}) {
  return await api.put<User>(`/users/${id}`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const deleteUser = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  const res = await api.delete<Message>(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
