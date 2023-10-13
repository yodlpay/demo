import { Flex, Text, createStyles, rem } from "@mantine/core";
import { useLocation } from "react-router-dom";
import { MOBILE_BREAKPOINT } from "../styles/theme";
import { useLookup } from "../hooks/yodl";
import { hexToString } from "viem";

const useStyles = createStyles((theme) => ({
  container: {
    maxWidth: rem(388),
    padding: rem(32),
    margin: "auto",
    background: theme.colors?.level?.[0],
    border: `1px solid ${theme.colors?.level?.[2]}`,
    borderRadius: theme.radius.xl,
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      padding: "32px 16px",
      maxWidth: rem(300),
    },
  },
}));

export default function Redirect() {
  const { classes } = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chainId = parseInt(searchParams.get("chainId") ?? "", 10);
  const txHash = searchParams.get("txHash");
  const { txDetails, isLoading, error } = useLookup(chainId, txHash);

  if (!chainId || !txHash || isNaN(chainId)) {
    return (
      <Flex direction="column" className={classes.container} gap={16}>
        <Text c="primary.0" weight={600} size={28} align="center">
          Invalid redirect parameters!
        </Text>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex direction="column" className={classes.container} gap={16}>
        <Flex direction="column" gap={16}>
          <Text c="primary.0" weight={600} size={28} align="center">
            Verifying payment...
          </Text>
        </Flex>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" className={classes.container} gap={16}>
        <Flex direction="column" gap={16}>
          <Text c="primary.0" weight={600} size={28} align="center">
            Failed to top up!
          </Text>
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
      <Flex direction="column" mt={32}>
        <Flex direction="row" gap={8} mb={16} justify="space-between">
          <Text c="primary.0" weight={400} size={16} align="left">
            Top up amount
          </Text>
          <Text c="positive.0" weight={600} size={16} align="right">
            {txDetails?.invoiceAmount} {txDetails?.invoiceCurrency}
          </Text>
        </Flex>
        <Flex direction="row" gap={8} mb={16} justify="space-between">
          <Text c="primary.0" weight={400} size={16} align="left">
            Invoice ID
          </Text>
          <Text
            c="positive.0"
            weight={600}
            size={16}
            align="right"
            style={{
              whiteSpace: "normal",
              overflowWrap: "break-word",
              maxWidth: "50%",
            }}
          >
            {hexToString((txDetails?.memo as `0x${string}`) ?? "0x0")}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
