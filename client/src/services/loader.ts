import { User } from "@/types/user.type";
import { getUsersQuery } from "./user.service";
import { LoaderType } from "@/types";
import { Disbursement } from "@/types/disbursement.type";
import { getDisbursementsQuery } from "./disbursement.service";
import { Mortgage } from "@/types/mortgage.type";
import { getMortgagesQuery } from "./mortgage.service";
import { Farm } from "@/types/farm.type";
import { getFarmsQuery } from "./farm.service";
import { getFarmersQuery } from "./farmer.service";
import { Farmer } from "@/types/farmer.type";

export const userLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getUsersQuery(token);
    return (
      queryClient.getQueryData<User[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const disbursementLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getDisbursementsQuery(token);
    return (
      queryClient.getQueryData<Disbursement[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const mortgageLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getMortgagesQuery(token);
    return (
      queryClient.getQueryData<Mortgage[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getFarmsQuery(token);
    return (
      queryClient.getQueryData<Farm[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmerLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getFarmersQuery(token);
    return (
      queryClient.getQueryData<Farmer[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const mapLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const farmerRes = farmerLoader({ token, queryClient });
    const farmRes = farmLoader({ token, queryClient });

    const [farmers, farms] = await Promise.all([farmerRes(), farmRes()]);

    return {
      farmers,
      farms,
    };
  };
