import { TxDetails } from "../types";
import { useEffect, useState } from "react";
import { MAX_FETCH_TX_ATTEMPTS, TX_FETCH_INTERVAL } from "../constants";
import { sleep } from "../helpers";

export const useLookup = (chainId: number | null, txHash: string | null) => {
  const [txDetails, setTxDetails] = useState<TxDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getTxDetails = async () => {
      try {
        let attempts = 0;
        let res;
        while (attempts < MAX_FETCH_TX_ATTEMPTS) {
          attempts += 1;
          res = await fetch(
            `${process.env.REACT_APP_YODL_URL}/lookup/${chainId}/${txHash}`,
          );
          if (!res.ok && res.status !== 404) {
            const message = `Failed to lookup payment on chain ${chainId} with hash ${txHash} with status code ${res.status}`;
            console.error(message);
            setError(new Error(message));
            setIsLoading(false);
            return;
          }

          await sleep(TX_FETCH_INTERVAL);
        }

        if (!res || !res.ok) {
          const message = `Failed to lookup payment on chain ${chainId} with hash ${txHash} with status code ${res?.status}`;
          console.error(message);
          setError(new Error(message));
          setIsLoading(false);
          return;
        }

        const txDetails = (await res.json()) as TxDetails[];
        setTxDetails(txDetails[0]);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    if (!!chainId && !isNaN(chainId) && !!txHash) {
      setIsLoading(true);
      setError(null);
      getTxDetails();
    }
  }, [chainId, txHash]);

  return {
    txDetails,
    isLoading,
    error,
  };
};
