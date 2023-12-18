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
import { useNavigate } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  capitalizeFirstLetter,
  truncateEthAddress,
  truncateTxHash,
} from "../helpers";
import { fetchTransactions } from "../services";
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

type TransactionsState = {
  data: LookupTxDetails[] | null;
  loading: boolean;
  error: null | Error;
};

export default function Transactions() {
  const [state, setState] = useState<TransactionsState>({
    data: null,
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  const handleRowClick = (txHash: string) => {
    navigate(`/transactions/${txHash}`);
  };

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
      state.data?.map((item) => ({
        txHash: item.txHash,
        memo: item.memo || "N/A",
        receiver: item.receiver,
        tokenSymbol: item.tokenSymbol,
        tokenAmount: item.tokenAmount?.formatted,
        totalFees: item.totalFees?.formatted,
        invoiceAmount: item.invoiceAmount,
        invoiceCurrency: item.invoiceCurrency,
        conversion: capitalizeFirstLetter(item.conversion),
        priceFeeds: item.priceFeeds
          ?.map((item) => `${item.rate}:${item.name}`)
          ?.join(","),
      })) ?? [],
    [state.data]
  );

  const { classes } = useStyles();

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row.original.txHash),
      style: { cursor: "pointer" },
    }),
  });

  const getTransactions = useCallback(async () => {
    try {
      const transaction = await fetchTransactions();
      setState({ data: transaction, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err as Error });
    }
  }, []);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

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
            Failed to fetch transactions
          </Text>
        </Flex>
      ) : state.loading ? (
        <Flex direction="column" align="center" justify="center" gap="md">
          <Loader color="dark" size="32px" />
          <Text size={16} weight={600}>
            Loading transactions...
          </Text>
        </Flex>
      ) : state.data?.length ? (
        <Flex className={classes.tableContainer}>
          <Title order={6} mb="sm">
            Transactions
          </Title>
          <MantineReactTable table={table} />
        </Flex>
      ) : (
        <Flex direction="column" align="center" justify="center" gap="md">
          <MagnifyingGlassCircleIcon width="32px" />
          <Text size={16} weight={600}>
            No transactions recorded yet
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
