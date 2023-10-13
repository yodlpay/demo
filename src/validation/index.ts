import { z } from "zod";
import { DEMO_CURRENCIES } from "../constants";

export const demoTopupSchema = z.object({
  amount: z.preprocess(
    (value) => parseInt(z.string().parse(value), 10),
    z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Invalid amount",
      })
      .positive({ message: "Amount must be positive" })
      .min(1)
  ),
  currency: z.enum(
    DEMO_CURRENCIES.map((currency) => currency.value) as [string, ...string[]]
  ),
});
