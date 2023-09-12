import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { SERVER } from "@/constant/server.constant";
import { User } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
interface UsersQueryResponse {
  users: User[];
}

export function useGetUsers() {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async () => {
      const headers = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGZmMzY2MDY3YWUzODBmY2NmM2FkMDkiLCJpYXQiOjE2OTQ0OTA2MTMsImV4cCI6MTY5NDQ5NDIxM30.qq-T7_RWyLK-W1PInEYJRrQ5cXwEgZsDOxVzoS9gNkk`, // Set the Authorization header with the token
      };

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
        { headers }
      );
      return data.users;
    },
  });
}
