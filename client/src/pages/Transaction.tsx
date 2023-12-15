import {
  ExclamationCircleIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";
import { Flex, Loader, Text, Title, createStyles } from "@mantine/core";
import {
  MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  capitalizeFirstLetter,
  truncateEthAddress,
  truncateTxHash,
} from "../helpers";
import { fetchTransaction } from "../services";
import { LookupTxDetails, TableData } from "../types";

const useStyles = createStyles(() => ({
  container: {
    flex: 1,
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1024px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    margin: "0 auto",
  },
}));

type TransactionState = {
  data: LookupTxDetails | null;
  loading: boolean;
  error: null | Error;
};

export default function Transaction() {
  const [state, setState] = useState<TransactionState>({
    data: null,
    loading: true,
    error: null,
  });

  const { txHash } = useParams();

  const columns = useMemo<MRT_ColumnDef<TableData>[]>(
    () => [
      {
        accessorKey: "txHash",
        header: "Tx hash",
        Cell: ({ cell }) => {
          return truncateTxHash(cell.getValue() as string);
        },
      },
      {
        accessorKey: "memo",
        header: "Memo",
      },
      {
        accessorKey: "receiver",
        header: "Receiver",
        Cell: ({ cell }) => {
          return truncateEthAddress(cell.getValue() as string);
        },
      },
      {
        accessorKey: "tokenSymbol",
        header: "Token symbol",
      },
      {
        accessorKey: "tokenAmount",
        header: "Token amount",
      },
      {
        accessorKey: "totalFees",
        header: "Total fees",
      },
      {
        accessorKey: "invoiceAmount",
        header: "Invoice amount",
      },
      {
        accessorKey: "invoiceCurrency",
        header: "Invoice currency",
      },
      {
        accessorKey: "conversion",
        header: "Conversion",
      },
      {
        accessorKey: "priceFeeds",
        header: "Price feeds",
      },
    ],
    []
  );

  const data = useMemo<TableData[]>(
    () =>
      state.data
        ? [
            {
              txHash: state.data.txHash,
              memo: state.data.memo || "N/A",
              receiver: state.data.receiver,
              tokenSymbol: state.data.tokenSymbol,
              tokenAmount: state.data.tokenAmount?.formatted,
              totalFees: state.data.totalFees?.formatted,
              invoiceAmount: state.data.invoiceAmount,
              invoiceCurrency: state.data.invoiceCurrency,
              conversion: capitalizeFirstLetter(state.data.conversion),
              priceFeeds: state.data.priceFeeds
                ?.map((feed) => `${feed.rate}:${feed.name}`)
                ?.join(","),
            },
          ]
        : [],
    [state.data]
  );

  const { classes } = useStyles();

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableGlobalFilter: false,
  });

  const getTransaction = useCallback(async () => {
    try {
      if (!txHash)
        return setState({
          data: null,
          loading: false,
          error: new Error("No tx hash provided"),
        });
      const transaction = await fetchTransaction(txHash);
      setState({ data: transaction, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err as Error });
    }
  }, [txHash]);

  useEffect(() => {
    getTransaction();
  }, [getTransaction]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      p="32px"
      className={classes.container}
    >
      {state.error ? (
        <Flex direction="column" align="center" justify="center" gap="md">
          <ExclamationCircleIcon width="32px" />
          <Text size={16} weight={600}>
            Failed to fetch transaction
          </Text>
        </Flex>
      ) : state.loading ? (
        <Flex direction="column" align="center" justify="center" gap="md">
          <Loader color="dark" size="32px" />
          <Text size={16} weight={600}>
            Loading transaction...
          </Text>
        </Flex>
      ) : state.data ? (
        <Flex className={classes.tableContainer}>
          <Title order={6} mb="sm">
            Transaction details
          </Title>
          <MantineReactTable table={table} />
        </Flex>
      ) : (
        <Flex direction="column" align="center" justify="center" gap="md">
          <MagnifyingGlassCircleIcon width="32px" />
          <Text size={16} weight={600}>
            Transaction not found
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
