import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { SERVER } from "@/constant/server.constant";
import { User } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";
interface UsersQueryResponse {
  users: User[];
}

export function useGetUsers() {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async () => {
      const data = await request<UsersQueryResponse>(
        SERVER,
        gql`
          query {
            users {
              id
              firstname
              lastname
              email
              userRole
              createdAt
              updatedAt
            }
          }
        `,
      );
      return data.users;
    },
  });
}
