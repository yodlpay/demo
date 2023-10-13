import { z } from "zod";
import { DEMO_CURRENCIES } from "../constants";

export const demoTopupSchema = z.object({
  amount: z.preprocess(
    (value) => {
      const parsed = parseInt(value as string, 10);
      if (isNaN(parsed)) {
        throw new Error('Invalid amount');
      }
      return parsed;
    },
    z.number()
      .positive({ message: "Amount must be positive" })
      .min(1, { message: "Amount must be at least 1" })
  ),
  currency: z.enum(
    DEMO_CURRENCIES.map((currency) => currency.value) as [string, ...string[]]
  ),
});
