import { Flex, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    background: theme.colors?.level?.[0],
  },
}));

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <Flex align="center" justify="flex-start" p={16} className={classes.footer}>
      <Text size={13}>©&nbsp;{new Date().getFullYear()}</Text>
      <Text size={13} weight={600}>
        &nbsp;YODL
      </Text>
    </Flex>
  );
};
