export type PriceFeed = {
  name: string;
  contract: string;
  rate: string;
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
