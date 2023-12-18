import { z } from "zod";
import { DEMO_CURRENCIES, DEMO_TOKENS } from "../constants";

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

export const settingsSchema = z.object({
  address: z
    .string()
    .regex(/.*(?<!\.eth)$/, "ENS domain not yet supported coming soon.")
    .refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), {
      message: "Invalid address",
      path: [],
    }),
  token: z.enum(
    DEMO_TOKENS.map((token) => token.value) as [string, ...string[]],
    { required_error: "Token is required", invalid_type_error: "Invalid token" }
  ),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 20 characters" }),
  apiKey: z
    .string({
      required_error: "API key is required",
      invalid_type_error: "API key must be a string",
    })
    .min(36, { message: "API key must be 36 characters long" })
    .min(36, { message: "API key must be 36 characters long" }),
});
