import {
  CreditCardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flex,
  NativeSelect,
  NumberInput,
  Text,
  TextInput,
  Tooltip,
  createStyles,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { DEMO_CURRENCIES, LOCAL_STORAGE_PAYMENT_KEY } from "../constants";
import { MOBILE_BREAKPOINT, theme } from "../styles/theme";
import { demoTopupSchema } from "../validation";
import { Settings } from "./Settings";

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

  input: {
    "& .mantine-TextInput-icon": {
      width: "auto",
      padding: "0 12px",
    },
    "& .mantine-TextInput-input[data-with-icon]": {
      paddingLeft: rem(28),
    },
    "& .mantine-Input-rightSection": {
      width: "auto",

      "& > div": {
        height: "100%",
        "& > div": {
          height: "100%",
          "& > select": {
            height: "100%",
          },
        },
      },
    },

    "& .mantine-NativeSelect-input": {
      minHeight: 0,
      lineHeight: "normal",
      cursor: "pointer",
      paddingRight: rem(16),
    },

    "& .mantine-NativeSelect-rightSection": {
      marginRight: rem(8),
    },
  },
  creditCardButton: {
    cursor: "auto",
    opacity: 0.5,
    "&:hover": {
      background: "transparent !important",
    },
    "&:active": {
      transform: "none",
    },
  },
  topUpButton: {
    background: `${theme.colors?.brand?.[0]} !important`,
  },
  settingsButton: {
    color: theme.colors?.primary?.[0],
    "&:hover": {
      background: theme.colors?.level?.[1],
    },
  },
}));

type FormState = {
  amount: number;
  currency: string;
  memo: string;
};

export default function Home() {
  const [opened, setOpened] = useState(false);

  const methods = useForm<FormState>({
    reValidateMode: "onChange",
    defaultValues: {
      amount: 1,
      currency: "eur",
      memo: uuidv4().replace(/-/g, ""),
    } as FormState,
    resolver: zodResolver(demoTopupSchema),
  });

  const { watch, formState, handleSubmit } = methods;

  const values = watch();

  const error = formState.errors.amount?.message;

  const { classes } = useStyles();

  const onSubmit = (data: FormState) => {
    console.log(data);
    const { amount, currency, memo } = methods.getValues();
    const baseUrl = `${process.env.REACT_APP_YODL_URL}/${process.env.REACT_APP_YODL_USERNAME}`;
    localStorage.setItem(
      LOCAL_STORAGE_PAYMENT_KEY,
      JSON.stringify({
        memo,
        amount,
        currency,
      })
    );
    const searchParams = new URLSearchParams({
      memo,
      amount: (amount * 100).toString(),
      currency,
    });
    const url = `${baseUrl}?${searchParams.toString()}`;
    console.log(url);
    window.location.href = url;
  };

  return (
    <Flex direction="column" className={classes.container} gap={16}>
      <Flex direction="column" gap={16}>
        <Text c="primary.0" weight={600} size={28} align="center">
          Top up your account
        </Text>
        <Text c="primary.0" size={16} align="center">
          Boost your balance in seconds
        </Text>
        <Button
          variant="subtle"
          onClick={() => setOpened(true)}
          className={classes.settingsButton}
        >
          Settings
        </Button>
      </Flex>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column">
            <Flex direction="column" gap={8} mb={16}>
              <Controller
                name="amount"
                control={methods.control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    className={classes.input}
                    decimalSeparator="."
                    thousandsSeparator=","
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "") as ""}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value as string))
                        ? `${value}`.replace(
                            /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                            ","
                          )
                        : ""
                    }
                    precision={2}
                    label="Top-up amount"
                    icon={
                      DEMO_CURRENCIES.find(
                        (item) => item.value === values.currency
                      )?.icon
                    }
                    error={error}
                    rightSection={
                      <Controller
                        name="currency"
                        control={methods.control}
                        render={({ field }) => (
                          <NativeSelect
                            {...field}
                            data={DEMO_CURRENCIES}
                            rightSectionWidth={28}
                            styles={{
                              input: {
                                fontWeight: 500,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                width: rem(92),
                                marginRight: rem(-2),
                              },
                            }}
                          />
                        )}
                      />
                    }
                  />
                )}
              />
              <Controller
                name="memo"
                control={methods.control}
                render={({ field }) => <TextInput {...field} label="Memo" />}
              />
            </Flex>
            <Tooltip label="Boring... Why not try YODL?">
              <Button
                type="button"
                variant="outline"
                color="subtle.0"
                fullWidth
                leftIcon={
                  <CreditCardIcon
                    color={theme.colors?.subtle?.[0]}
                    width="24px"
                    height="24px"
                  />
                }
                mt={12}
                className={classes.creditCardButton}
              >
                Credit card
              </Button>
            </Tooltip>
            <Button
              type="submit"
              variant="filled"
              color="brand.0"
              fullWidth
              leftIcon={
                <CurrencyDollarIcon color="white" width="24px" height="24px" />
              }
              mt={12}
              className={classes.topUpButton}
            >
              YODL
            </Button>
          </Flex>
        </form>
      </FormProvider>
      <Settings opened={opened} handleClose={() => setOpened(false)} />
    </Flex>
  );
}
