import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { ISession } from "../models/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.util";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<ISession>) {
  return SessionModel.find(query).lean();
}

export async function findSession(query: FilterQuery<ISession>) {
  return SessionModel.findOne(query).lean().populate("user");
}

export async function updateSession(
  query: FilterQuery<ISession>,
  update: UpdateQuery<ISession>,
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

  if (!decoded || !get(decoded, "session")) {
    return { user: null, sub: null, accessToken: null };
  }

  const session = await findSession({ _id: get(decoded, "session") });

  if (!session || !session.valid) {
    return { user: null, sub: null, accessToken: null };
  }

  const user = session.user;

  if (!user) {
    return { user, sub: null, accessToken: null };
  }

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }, // 15 minutes
  );

  return { user, sub: session._id, accessToken };
}
