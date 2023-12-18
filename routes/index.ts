import bodyParser from "body-parser";
import { Router } from "express";
import {
  getTransaction,
  getTransactions,
  processTransaction,
} from "../controllers";

const router = Router();

router.route("/transactions/:txHash").get(getTransaction);

router
  .route("/transactions")
  .get(getTransactions)
  .post(bodyParser.raw({ type: "application/json" }), processTransaction);

export default router;
