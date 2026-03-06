import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#10b981",
          dark: "#0a0a0f",
          card: "#111118",
          elevated: "#16161f",
          border: "#1e1e2a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
