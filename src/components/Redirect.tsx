import { Flex, Text, TextInput, createStyles, rem } from "@mantine/core";
import { MOBILE_BREAKPOINT } from "../styles/theme";

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

  return (
    <Flex direction="column" className={classes.container} gap={16}>
      <Flex direction="column" gap={16}>
        <Text c="primary.0" weight={600} size={28} align="center">
          Payment details
        </Text>
      </Flex>
      <Flex direction="column" mt={32}>
        <Flex direction="column" gap={8} mb={16}>
          <TextInput label="Top up amount" value={0} disabled />
          <TextInput label="Memo" value={""} disabled />
        </Flex>
      </Flex>
    </Flex>
  );
}
