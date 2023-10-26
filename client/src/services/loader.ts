import { LoaderType } from "@/types";
import { Disbursement } from "@/types/disbursement.type";
import { Farm } from "@/types/farm.type";
import { Farmer } from "@/types/farmer.type";
import { Mortgage } from "@/types/mortgage.type";
import { User } from "@/types/user.type";
import { getDisbursementsQuery } from "./disbursement.service";
import { getFarmQuery, getFarmsQuery } from "./farm.service";
import { getFarmersQuery } from "./farmer.service";
import { getMortgagesQuery } from "./mortgage.service";
import { getUsersQuery } from "./user.service";
import { LoaderFunctionArgs } from "react-router-dom";

export const usersLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getUsersQuery(token);
    return (
      queryClient.getQueryData<User[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const disbursementsLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getDisbursementsQuery(token);
    return (
      queryClient.getQueryData<Disbursement[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const mortgagesLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getMortgagesQuery(token);
    return (
      queryClient.getQueryData<Mortgage[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmsLoader =
  ({ token, queryClient }: LoaderType) =>
  async () => {
    const query = getFarmsQuery(token);
    return (
      queryClient.getQueryData<Farm[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const farmLoader =
  ({ token, queryClient }: LoaderType) =>
  async ({ params }: LoaderFunctionArgs) => {
    const farmId = params.farmId ?? "";
    const query = getFarmQuery({ token, farmId });
    const farm =
      queryClient.getQueryData<Farm>(query.queryKey) ??
      (await queryClient.fetchQuery(query));
    return farm;
  };

export const farmersLoader =
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
    const farmerRes = farmersLoader({ token, queryClient });
    const farmRes = farmsLoader({ token, queryClient });

    const [farmers, farms] = await Promise.all([farmerRes(), farmRes()]);

    return {
      farmers,
      farms,
    };
  };
