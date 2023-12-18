import redis from "../connectors/redis";
import { LookupTxDetails } from "../types";

export const getTransaction = async (txHash: string) => {
  return await redis.getValue(txHash);
};

export const getTransactions = async () => {
  return await redis.getValues();
};

export const processTransaction = async (payload: LookupTxDetails) => {
  return await redis.setValue(payload.txHash, JSON.stringify(payload));
};
