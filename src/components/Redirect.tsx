import { Flex, Loader, Text, createStyles, rem } from "@mantine/core";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useVerify } from "../hooks/yodl";
import { MOBILE_BREAKPOINT } from "../styles/theme";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import * as chains from "viem/chains";

function getChain(chainId: number) {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }
}

function constructUrl(chainId?: number, txHash?: string) {
  const chain = getChain(chainId ?? -1);
  if (chain && "blockExplorers" in chain) {
    return `${chain.blockExplorers?.default?.url}/tx/${txHash}`;
  }
  return "";
}

function truncateUrl(
  url: string,
  startLength: number = 10,
  endLength: number = 10,
  delimiter: string = "..."
): string {
  if (url.length <= startLength + endLength) {
    return url;
  }

  const startPart = url.substring(0, startLength);
  const endPart = url.substring(url.length - endLength);

  return `${startPart}${delimiter}${endPart}`;
}

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: "388px",
    padding: rem(32),
    margin: "auto",
    background: theme.colors?.level?.[0],
    border: `1px solid ${theme.colors?.level?.[2]}`,
    borderRadius: theme.radius.xl,
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      padding: "32px 16px",
      maxWidth: "300px",
    },
  },
  icon: {
    width: "26px",
    color: theme.colors?.error?.[0],
  },
}));

export default function Redirect() {
  const { classes } = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chainId = parseInt(searchParams.get("chainId") ?? "", 10);
  const txHash = searchParams.get("txHash");
  const paymentDetails = useMemo(
    () => JSON.parse(localStorage.getItem("payment") ?? ""),
    []
  );
  const { txDetails, isVerified, isLoading, error } = useVerify(
    chainId,
    txHash,
    paymentDetails
  );

  const txUrl = constructUrl(txDetails?.chainId, txDetails?.txHash);

  const isMalformed = !chainId || !txHash || isNaN(chainId);

  const isInvalid =
    txDetails?.receiver.toLowerCase() !==
      (process.env.REACT_APP_YODL_ADDRESS ?? "").toLowerCase() ||
    txDetails?.tokenSymbol.toLowerCase() !==
      (process.env.REACT_APP_ACCEPTED_SYMBOL ?? "").toLowerCase() ||
    txDetails?.memo !== paymentDetails?.memo ||
    !isVerified;

  let message, color;
  if (isMalformed) {
    message = "Invalid redirect parameters!";
    color = "error.0";
  } else if (isLoading) {
    message = "Verifying payment...";
    color = "primary.0";
  } else if (error) {
    message = "Failed to fetch top up details!";
    color = "error.0";
  } else if (isInvalid) {
    message = "Top up payment was invalid!";
    color = "error.0";
  }

  if (!!message) {
    return (
      <Flex direction="column" className={classes.container} gap={16}>
        <Flex align="center" gap={18}>
          <Text c={color} weight={600} size={16} align="center">
            {message}
          </Text>
          {isLoading && <Loader size="sm" variant="dots" color="brand.0" />}
          {!isLoading && (isMalformed || error || isInvalid) && (
            <ExclamationTriangleIcon className={classes.icon} />
          )}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" className={classes.container} gap={16}>
      <Flex direction="column" gap={16}>
        <Text c="primary.0" weight={600} size={28} align="center">
          Successfully topped up!
        </Text>
      </Flex>
      <Flex direction="column" mt={32} gap={16}>
        <Flex direction="row" gap={8} justify="space-between">
          <Text c="primary.0" weight={400} size={16} align="left">
            Top up amount
          </Text>
          <Text weight={600} size={16} align="right">
            {txDetails?.invoiceAmount} {txDetails?.invoiceCurrency}
          </Text>
        </Flex>
        <Flex direction="row" gap={8} justify="space-between">
          <Text c="primary.0" weight={400} size={16} align="left">
            Status
          </Text>
          <Text c="positive.0" weight={600} size={16} align="right">
            Verified
          </Text>
        </Flex>
        {txUrl && (
          <Flex direction="row" gap={8} justify="space-between">
            <Text c="primary.0" weight={400} size={16} align="left">
              Transaction
            </Text>
            <Text
              component="a"
              target="_blank"
              href={txUrl}
              weight={600}
              size={16}
              align="right"
            >
              {truncateUrl(txUrl)}
            </Text>
          </Flex>
        )}
        {txDetails?.memo && (
          <Flex direction="row" gap={8} justify="space-between">
            <Text c="primary.0" weight={400} size={16} align="left">
              Invoice ID
            </Text>
            <Text
              weight={600}
              size={16}
              align="right"
              style={{
                whiteSpace: "normal",
                overflowWrap: "break-word",
                maxWidth: "50%",
              }}
            >
              {txDetails?.memo}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
