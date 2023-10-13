import { z } from "zod";
import { DEMO_CURRENCIES } from "../constants";

export const demoTopupSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Invalid amount",
    })
    .min(0.01, { message: "Amount must be at least 0.01" }),
  currency: z.enum(
    DEMO_CURRENCIES.map((currency) => currency.value) as [string, ...string[]]
  ),
});
