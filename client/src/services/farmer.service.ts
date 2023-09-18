import { QUERY_FARMERS_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { farmersSchema } from "@/lib/validations/farmer";
import { Farmer } from "@/types/farmer.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetFarmers({
  token,
  options,
}: {
  token: string;
  options?: UseQueryOptions<Farmer[], AxiosError>;
}) {
  return useQuery({
    queryKey: [QUERY_FARMERS_KEY],
    queryFn: async () => {
      const res = await api.get("/farmers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return farmersSchema.parse({ farmers: res.data }).farmers;
    },
    ...options,
  });
}

// export async function createUser({
//   token,
//   data,
// }: {
//   token: string;
//   data: CreateInputs;
// }) {
//   return await api.post<User>("/users", JSON.stringify(data), {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

// export async function updateUser({
//   token,
//   id,
//   data,
// }: {
//   token: string;
//   id: string;
//   data: CreateInputs;
// }) {
//   return await api.put<User>(`/users/${id}`, JSON.stringify(data), {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

// export const deleteUser = async ({
//   token,
//   id,
// }: {
//   token: string;
//   id: string;
// }) => {
//   const res = await api.delete<Message>(`/users/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res;
// };
