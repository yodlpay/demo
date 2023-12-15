import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { RedisClientType, createClient } from "redis";
import { isProduction, redisDevUrl, redisProdUrl } from "../config";

const client: RedisClientType = createClient({
  url: isProduction ? redisProdUrl : redisDevUrl,
});

client.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error", err);
    throw err; // Throw error to handle it in the caller
  }
};

const getValues = async () => {
  const keys: RedisCommandArgument[] = [];

  for await (const key of client.scanIterator({
    MATCH: "*",
    COUNT: 100,
  })) {
    keys.push(key);
  }

  if (keys.length === 0) {
    return [];
  }

  const values = await client.mGet(keys);

  return keys.map((key, index) => ({ key, value: values[index] }));
};

const setValue = async (key: string, value: string) => {
  return await client.set(key, value);
};

const getValue = async (key: string) => {
  return await client.get(key);
};

const updateValue = async (key: string, value: string) => {
  return await client.set(key, value);
};

const deleteValue = async (key: string) => {
  return await client.del(key);
};

export default {
  getValues,
  setValue,
  getValue,
  updateValue,
  deleteValue,
  connectRedis,
};
