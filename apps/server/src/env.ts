import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.number().default(5000),
    DB_CONNECTION: z.string().url(),
    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    ACCESS_TOKEN_PUBLIC_KEY: z.string(),
    REFRESH_PRIVATE_KEY: z.string(),
    REFRESH_PUBLIC_KEY: z.string(),
    UPLOADTHING_APP_ID: z.string(),
    UPLOADTHING_SECRET: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_CONNECTION: process.env.DB_CONNECTION,
    ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_PRIVATE_KEY: process.env.REFRESH_PRIVATE_KEY,
    REFRESH_PUBLIC_KEY: process.env.REFRESH_PUBLIC_KEY,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
