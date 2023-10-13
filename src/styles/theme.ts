import {
  DEFAULT_THEME,
  createStyles,
  rem,
  type CSSObject,
  type DefaultMantineColor,
  type MantineThemeOverride,
  type Tuple,
} from "@mantine/core";

export type ExtendedMantineSize = number | "xs" | "sm" | "md" | "lg" | "xl";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type Color =
  | DeepPartial<
      Record<
        DefaultMantineColor,
        [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string
        ]
      >
    >
  | undefined;

export const MOBILE_BREAKPOINT = 452;

export const CONTENT_PADDING = 32;
export const MOBILE_CONTENT_PADDING = 16;

export const CUSTOM_COLORS = {
  modayOverlay: "rgba(16, 17, 19, 0.9)",
  positiveLight: "rgba(43, 138, 62, 1)",
  positiveDark: "rgba(211, 249, 216, 1)",
  positiveBase: "rgba(43, 138, 62, 0.25)",
  positiveLightInactive: "rgba(138, 43, 62, 1)",
  positiveDarkInactive: "rgba(249, 211, 216, 1)",
  positiveBaseInactive: "rgba(138, 43, 62, 0.25)",
};

export const CUSTOM_ACCESSIBILITY_SPACING = 4;

export const SIZE_OPTIONS = ["xs", "sm", "md", "lg", "xl"];
export const MINIMAL_SIZE_OPTIONS = ["sm", "md", "lg"];

export const THEME_COLORS: Color = {
  brand: [DEFAULT_THEME.colors.indigo[9]],
  base: [DEFAULT_THEME.colors.dark[8]],
  level: [
    DEFAULT_THEME.colors.dark[7],
    DEFAULT_THEME.colors.dark[6],
    DEFAULT_THEME.colors.dark[4],
  ],
  modalOverlay: [CUSTOM_COLORS.modayOverlay],
  positiveBase: [CUSTOM_COLORS.positiveBase],
  primary: [DEFAULT_THEME.colors.gray[0]],
  subtle: [DEFAULT_THEME.colors.gray[6]],
  onColor: ["#FFFFFF"],
  disabled: [DEFAULT_THEME.colors.gray[7]],
  error: [DEFAULT_THEME.colors.red[6]],
  positive: [CUSTOM_COLORS.positiveDark],
};

export const MOBILE_HEADING_SIZES = {
  h1: { fontSize: rem(36) },
  h2: { fontSize: rem(32) },
  h3: { fontSize: rem(28) },
  h4: { fontSize: rem(24) },
  h5: { fontSize: rem(20) },
  h6: { fontSize: rem(18) },
};

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
  colors: {
    ...DEFAULT_THEME.colors,
    ...THEME_COLORS,
  },
  defaultRadius: "md",
  radius: {
    xl: rem(16),
    lg: rem(12),
    md: rem(8),
    sm: rem(4),
    xs: rem(2),
  },
  fontSizes: {
    xl: rem(18),
    lg: rem(16),
    md: rem(15),
    sm: rem(14),
    xs: rem(13),
  },
  headings: {
    sizes: {
      h1: { fontSize: rem(40) },
      h2: { fontSize: rem(36) },
      h3: { fontSize: rem(32) },
      h4: { fontSize: rem(28) },
      h5: { fontSize: rem(22) },
      h6: { fontSize: rem(20) },
    },
  },
  globalStyles: (theme) => ({
    ".container-wrapper": {
      flexGrow: 1,
      padding: `${rem(CONTENT_PADDING)} ${rem(CONTENT_PADDING)}`,
      [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
        padding: `${rem(CONTENT_PADDING)} ${rem(MOBILE_CONTENT_PADDING)}`,
      },
    },
    ".mantine-Tooltip-tooltip": {
      fontSize: "12px",
    },
    ".mantine-NavLink-icon": {
      alignSelf: "auto",
    },
    "@keyframes fadeAndScaleIn": {
      from: {
        opacity: 0,
        transform: "scale(0.9)",
      },
      to: {
        opacity: 1,
        transform: "scale(1)",
      },
    },
  }),
};

export const useNavLinkStyles = createStyles((theme) => ({
  icon: {
    height: "32px",
    width: "32px",
    fill: theme.colors?.subtle?.[0],
  },
  disabledIcon: {
    height: "24px",
    width: "32px",
    fill: theme.colors?.subtle?.[0],
    transform: "rotate(90deg)",
  },
}));

export const usePaymentStyles = createStyles((theme) => ({
  flex: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
  },
  noGrow: {
    flexGrow: 0,
  },
  fullGrow: {
    flexGrow: 1,
  },
  divider: {
    borderBottom: `1px solid ${theme.colors.level[2]}`,
    paddingBottom: `${rem(24)}`,
    marginBottom: `${rem(24)}`,
  },
  icon: {
    marginLeft: "4px",
    transition: "transform 200ms ease",
    fill: theme.colors?.subtle?.[0],
  },
  iconActivated: {
    marginLeft: "4px",
    transform: "rotate(180deg)",
    transition: "transform 200ms ease",
    fill: theme.colors?.subtle?.[0],
  },
  collapseButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 400,
    height: "auto",
  },
}));

export const getColorFromProp = (colorProp: string) => {
  const [colorName, shade] = colorProp.split(".");

  const actualShade = shade ? parseInt(shade) : 0;

  const colorValue = theme.colors?.[colorName]?.[actualShade];

  return colorValue ?? "";
};

export const addLineClamp = (numberOfLines = 1): CSSObject => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "block",

  "@supports (-webkit-line-clamp: 1)": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "initial",
    WebkitLineClamp: numberOfLines,
    WebkitBoxOrient: "vertical",
  },
});

type ExtendedCustomColors =
  | "primaryColorName"
  | "secondaryColorName"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
