export type PriceFeed = {
  name: string;
  contract: string;
  rate: string;
};

export type TxDetails = {
  chainId: number;
  txHash: string;
  memo: string;
  receiver: string;
  tokenSymbol: string;
  tokenAmountGross: string;
  tokenAmountNet: string;
  tokenAmountGrossNative: string;
  tokenAmountNetNative: string;
  yodlFee: string;
  invoiceAmount: string;
  invoiceCurrency: string;
  conversion: string;
  priceFeeds: PriceFeed[];
};

export type FeeType = "YodlFee" | "ExtraFee";

export type FeeObject = CryptoValue & { type: FeeType };

export type CryptoValue = {
  formatted: string;
  value: string;
};

export type LookupTxDetails = {
  chainId: number;
  txHash: string;
  memo: string;
  receiver: string;
  tokenSymbol: string;
  tokenAmount: CryptoValue;
  tokenAmountNet: CryptoValue;
  totalFees: CryptoValue;
  fees: FeeObject[];
  invoiceAmount: string;
  invoiceCurrency: string;
  conversion: string;
  priceFeeds: PriceFeed[];
  blockNumber: number;
  final?: boolean;
};

export type VerifiedTxDetails = TxDetails & {
  verified: boolean;
  verificationErrors: string[];
};

export type VerifyResponse = {
  chainId: number;
  txHash: string;
  payments: VerifiedTxDetails[];
};

export type PaymentDetails = {
  memo: string;
  amount: number;
  currency: string;
};

export type TableData = {
  txHash: string;
  memo: string;
  receiver: string;
  tokenSymbol: string;
  tokenAmount: string;
  totalFees: string;
  invoiceAmount: string;
  invoiceCurrency: string;
  conversion: string;
  priceFeeds: string;
};
