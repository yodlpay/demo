import { Flex, Text, createStyles, rem } from "@mantine/core";
import { MOBILE_BREAKPOINT } from "../styles/theme";

const useStyles = createStyles((theme) => ({
  notFound: {
    padding: rem(32),
    maxWidth: rem(500),
    maxHeight: rem(500),
    width: "100%",
    height: "100%",
    margin: "auto",
    background: theme.colors?.level?.[0],
    border: `1px solid ${theme.colors?.level?.[2]}`,
    borderRadius: theme.radius.xl,
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      maxWidth: rem(300),
      maxHeight: rem(300),
    },
  },
  heading: {
    fontSize: rem(88),
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      fontSize: rem(54),
    },
  },
  subheading: {
    fontSize: rem(48),
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      fontSize: rem(32),
    },
  },
}));

export default function NotFound() {
  const { classes } = useStyles();

  return (
    <Flex
      direction="column"
      className={classes.notFound}
      align="center"
      justify="center"
      gap={16}
    >
      <Text className={classes.heading}>404</Text>
      <Text className={classes.subheading}>Page not found</Text>
    </Flex>
  );
}
