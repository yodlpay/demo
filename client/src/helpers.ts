import { LOCAL_STORAGE_SETTINGS_KEY } from "./constants";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const extractLocalStorageSettings = () => {
  const formValues = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (formValues) {
    return JSON.parse(formValues);
  }
  return {
    address: "0xDD641eFfd516e4fAdBAd782E78EF7D291c8221b1",
    token: "USDC",
    username: "webshopdemo",
    apiKey: "58bc4fe2-ade3-4b81-b8c4-a5cc386cb3d1",
  };
};

export const truncateTxHash = (
  hash: string,
  start: number = 5,
  end: number = 4
): string => {
  if (hash.length <= 2 * start) {
    return hash;
  }

  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
};

export const truncateEthAddress = (
  address: string,
  start: number = 7,
  end: number = 5
): string => {
  if (address.length <= 2 * start) {
    return address;
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
