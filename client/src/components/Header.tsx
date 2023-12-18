import { Button, Flex, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    background: theme.colors?.level?.[0],
  },
}));

export const Header = () => {
  const { classes } = useStyles();

  return (
    <Flex
      align="center"
      justify="space-between"
      p={16}
      className={classes.header}
    >
      <Text component="a" href="/" size={28}>
        TopUprr
      </Text>
      <Button
        c="primary.0"
        variant="subtle"
        component="a"
        href="https://yodl.me"
        target="_blank"
      >
        YODL
      </Button>
    </Flex>
  );
};
