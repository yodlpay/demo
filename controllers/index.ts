import crypto from "crypto";
import { Request, Response } from "express";
import { hmacSecret } from "../config";
import { hmacHeader } from "../constants";
import * as services from "../services";

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const txHash = req.params.txHash;
    const transaction = await services.getTransaction(txHash);
    res.send({ transaction });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't fetch transaction");
  }
};

export const getTransactions = async (_: Request, res: Response) => {
  try {
    const transactions = await services.getTransactions();
    res.send({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't fetch transactions");
  }
};

export const processTransaction = async (req: Request, res: Response) => {
  const receivedSignature = req.headers[hmacHeader];
  const hmac = crypto.createHmac("sha256", hmacSecret);
  hmac.update(req.body);
  const generatedSignature = hmac.digest("hex");

  if (receivedSignature !== generatedSignature) {
    return res.status(403).send("Invalid signature");
  }

  try {
    const payload = JSON.parse(req.body.toString());
    await services.processTransaction(payload);
    res.send("Transaction processed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't process transaction");
  }
};
