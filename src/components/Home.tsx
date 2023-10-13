import {
  CreditCardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flex,
  NativeSelect,
  Text,
  TextInput,
  Tooltip,
  createStyles,
  rem,
} from "@mantine/core";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { DEMO_CURRENCIES } from "../constants";
import { MOBILE_BREAKPOINT, theme } from "../styles/theme";
import { demoTopupSchema } from "../validation";
import { Controller } from "react-hook-form";

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
      // TODO: Tailwind overrides, can be removed once Tailwind is removed
      background: "transparent !important",
    },
    "&:active": {
      transform: "none",
    },
  },
  topUpButton: {
    // TODO: Tailwind overrides, can be removed once Tailwind is removed
    background: `${theme.colors?.brand?.[0]} !important`,
  },
}));

type FormState = {
  amount: number;
  currency: string;
};

export default function Home() {
  const methods = useForm<FormState>({
    reValidateMode: "onChange",
    defaultValues: {
      amount: 1,
      currency: "eur",
    } as FormState,
    resolver: zodResolver(demoTopupSchema),
  });

  const { watch, formState, handleSubmit } = methods;

  const values = watch();

  const memo = useMemo(() => uuidv4().replace(/-/g, ""), []);

  const error = formState.errors.amount?.message;

  const { classes } = useStyles();

  const onSubmit = (data: FormState) => {
    console.log(data);
    const { amount, currency } = methods.getValues();
    const baseUrl = `${process.env.REACT_APP_YODL_URL}/${process.env.REACT_APP_YODL_USERNAME}`;
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
      </Flex>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" mt={32}>
            <Flex direction="column" gap={8} mb={16}>
              <Controller
                name="amount"
                control={methods.control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className={classes.input}
                    label="Top-up amount"
                    icon={
                      DEMO_CURRENCIES.find(
                        (item) => item.value === values.currency,
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

              <TextInput label="Memo" value={memo} disabled />
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
                <CurrencyDollarIcon
                  color={theme.colors?.primary?.[0]}
                  width="24px"
                  height="24px"
                />
              }
              mt={12}
              className={classes.topUpButton}
            >
              YODL
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  );
}
