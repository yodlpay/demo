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