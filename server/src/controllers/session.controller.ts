import { Request, Response } from "express";
import config from "config";
import {
  createSession,
  findSession,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt, verifyJwt } from "../utils/jwt.util";
import { get, omit } from "lodash";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }, // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { sub: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") }, // 15 minutes
  );

  // return access & refresh tokens
  res.cookie("X-Agrimap-Session", refreshToken, {
    httpOnly: true,
  });

  return res.send({ user, accessToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const refreshToken = get(req, "cookies.X-Agrimap-Session");

  if (refreshToken) {
    const result = verifyJwt(refreshToken as string, "refreshTokenPublicKey");
    if (result.expired) {
      return res.send();
    }
    const sessionId = result.decoded?.sub;
    const session = await findSession({ _id: sessionId, valid: true });

    if (session && session.user) {
      const user = omit(session.user, ["password"]);
      const accessToken = signJwt(
        { ...user, session: session._id },
        "accessTokenPrivateKey",
        { expiresIn: config.get("accessTokenTtl") }, // 15 minutes,
      );

      return res.send({
        user: { ...user, id: user._id },
        accessToken,
      });
    }
  }

  return res.send();
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  res.cookie("X-Agrimap-Session", "", {
    httpOnly: true,
  });

  return res.send();
}
