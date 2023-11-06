import config from "config";
import { Request, Response } from "express";
import { get, omit } from "lodash";
import {
  createSession,
  findSession,
  updateSession,
} from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJwt, verifyJwt } from "../utils/jwt.util";
import logger from "../utils/logger";

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // Validate the user's password
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create an access token

    const accessToken = signJwt(
      { sub: session._id },
      "accessTokenPrivateKey",
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
    );

    // create a refresh token
    const refreshToken = signJwt(
      { sub: session._id },
      "refreshTokenPrivateKey",
      { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
    );

    // return access & refresh tokens
    res.cookie("X-Agrimap-Session", refreshToken, {
      httpOnly: true,
    });

    const omitedUser = omit(user, ["password"]);

    return res.send({ user: omitedUser, accessToken });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
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
        { sub: session._id },
        "accessTokenPrivateKey",
        { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
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
  const sessionId = res.locals.user?.sub;

  await updateSession({ _id: sessionId }, { valid: false });

  res.cookie("X-Agrimap-Session", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.send();
}