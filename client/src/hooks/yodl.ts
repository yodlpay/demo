import { useEffect, useState } from "react";
import { MAX_FETCH_TX_ATTEMPTS, TX_FETCH_INTERVAL } from "../constants";
import { extractLocalStorageSettings, sleep } from "../helpers";
import { PaymentDetails, TxDetails, VerifyResponse } from "../types";

export const useVerify = (
  chainId: number | null,
  txHash: string | null,
  paymentDetails: PaymentDetails | null
) => {
  const [txDetails, setTxDetails] = useState<TxDetails | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getTxDetails = async () => {
      try {
        const { address, username, apiKey } = extractLocalStorageSettings();
        const payload = {
          chainId,
          txHash,
          amount: paymentDetails?.amount,
          currency: paymentDetails?.currency.toUpperCase(),
          address: address,
          handle: username,
        };
        let attempts = 0;
        let res;
        while (attempts < MAX_FETCH_TX_ATTEMPTS) {
          attempts += 1;
          res = await fetch(`${process.env.REACT_APP_YODL_URL}/api/v1/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application.json",
              authorization: apiKey,
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            break;
          }

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

        const verifyResponse = (await res.json()) as VerifyResponse;
        const { verified, verificationErrors, ...txDetails } =
          verifyResponse.payments[0];
        setIsVerified(verified);
        setTxDetails(txDetails);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    if (!!chainId && !isNaN(chainId) && !!txHash && !!paymentDetails) {
      setIsLoading(true);
      setIsVerified(false);
      setError(null);
      getTxDetails();
    }
  }, [chainId, txHash, paymentDetails]);

  return {
    txDetails,
    isVerified,
    isLoading,
    error,
  };
};
