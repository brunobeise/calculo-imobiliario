/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    colors: {
      background: "#f1f2f4",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      cardForeground: "hsl(var(--card-foreground))",
      popover: "hsl(var(--popover))",
      popoverForeground: "hsl(var(--popover-foreground))",
      primary: "rgb(var(--primary))",
      primaryForeground: "hsl(var(--primary-foreground))",
      secondary: "rgb(241, 245, 249)",
      secondaryForeground: "hsl(var(--secondary-foreground))",
      muted: "hsl(var(--muted))",
      mutedForeground: "hsl(var(--muted-foreground))",
      accent: "hsl(var(--accent))",
      accentForeground: "hsl(var(--accent-foreground))",
      destructive: "hsl(var(--destructive))",
      destructiveForeground: "hsl(var(--destructive-foreground))",
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "rgb(var(--ring))",
      grayScale: {
        "50": "#f9fafb",
        "100": "#f3f4f6",
        "200": "#e5e7eb",
        "300": "#d1d5db",
        "400": "#9ca3af",
        "500": "#6b7280",
        "600": "#4b5563",
        "700": "#374151",
        "800": "#1f2937",
        "900": "#111827",
      },
      white: "#fafaf9",
      gray: "#bebebe",
      grayText: "#545454",
      whitefull: "#ffff",
      green: "#239e15",
      red: "#a82222",
      blackish: "#1c1d21;",
      black: "#000000",
    },
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        uw: "2000px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("postcss-nesting"),
    require("tailwind-scrollbar"),
  ],
};

export default config;
