import { extendTheme } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  // No custom tokens found, you can skip the theme augmentation.
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "50": "#e3f2fd",
          "100": "#bbdefb",
          "200": "#90caf9",
          "300": "#64b5f6",
          "400": "#004e93",
          "500": "#002f57",
          "600": "#004e93",
          "700": "#004e93",
          "800": "#1565c0",
          "900": "#0d47a1",
        },
        neutral: {
          "50": "#ffffff",
          "300": "#e7e5e4",
          "100": "#ffffff",
        },
      },
    },
    dark: {
      palette: {},
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640, // Tailwind's 'sm'
      md: 768, // Tailwind's 'md'
      lg: 1024, // Tailwind's 'lg'
      xl: 1280, // Tailwind's 'xl'
    },
  },
});

export default theme;
