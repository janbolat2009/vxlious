import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F5F5F7",
          dark: "#08090B",
        },
        surface: {
          light: "rgba(255, 255, 255, 0.72)",
          dark: "rgba(20, 21, 24, 0.65)",
          cardLight: "rgba(255, 255, 255, 0.8)",
          cardDark: "rgba(24, 25, 29, 0.7)",
        },
        border: {
          glassLight: "rgba(0, 0, 0, 0.07)",
          glassDark: "rgba(255, 255, 255, 0.09)",
        },
        text: {
          primaryLight: "#111111",
          primaryDark: "#F5F5F7",
          secondaryLight: "#6E6E73",
          secondaryDark: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#6366F1", // Sophisticated Indigo
          hover: "#4F46E5",
          light: "#818CF8",
          subtle: "rgba(99, 102, 241, 0.12)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.06)",
        glassDark: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        glassHover: "0 14px 40px 0 rgba(0, 0, 0, 0.10)",
        glassHoverDark: "0 14px 40px 0 rgba(0, 0, 0, 0.6)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
        heavy: "24px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
