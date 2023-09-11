import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";

const endpoint = "http://192.168.254.180:5000/graphql";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  userRole: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UsersQueryResponse {
  users: User[];
}

export function usePosts() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await request<UsersQueryResponse>(
        endpoint,
        gql`
          query {
            users {
              id
              firstname
              lastname
              username
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
