import dotenv from "dotenv";
import path from "path";

const __rootdir = path.resolve();

dotenv.config({
  path: path.resolve(__rootdir, ".env"),
  override: true,
});

export const environment = process.env.NODE_ENV;

export const isProduction = environment === "production";

// DEV
export const redisDevUrl = `redis://${process.env.REDIS_HOST ?? ""}:${
  process.env.REDIS_PORT ?? ""
}`;
// PROD
export const redisProdUrl = process.env.REDIS_URL ?? "";

export const hmacSecret = process.env.HMAC_SECRET ?? "";
