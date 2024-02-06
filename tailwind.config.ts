/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",


    },
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      cardForeground: 'hsl(var(--card-foreground))',
      popover: 'hsl(var(--popover))',
      popoverForeground: 'hsl(var(--popover-foreground))',
      primary: 'rgb(var(--primary))',
      primaryForeground: 'hsl(var(--primary-foreground))',
      secondary: 'hsl(var(--secondary))',
      secondaryForeground: 'hsl(var(--secondary-foreground))',
      muted: 'hsl(var(--muted))',
      mutedForeground: 'hsl(var(--muted-foreground))',
      accent: 'hsl(var(--accent))',
      accentForeground: 'hsl(var(--accent-foreground))',
      destructive: 'hsl(var(--destructive))',
      destructiveForeground: 'hsl(var(--destructive-foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'rgb(var(--ring))',
      white: "#fafaf9",
      whitefull: '#ffff'

    },
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'uw': '2000px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('postcss-nesting'),
  ],
}

export default config;