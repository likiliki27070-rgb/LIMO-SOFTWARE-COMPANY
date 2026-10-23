import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        limo: {
          navy: "#0A192F",
          navyDark: "#050D1A",
          navyLight: "#13233C",
          blue: "#0066FF",
          blueHover: "#0052CC",
          cyan: "#00D2FF",
          accent: "#2563EB",
          cardDark: "#0E1A2E",
          borderDark: "#1E2E48",
          surfaceDark: "#0B1526",
          slate: "#64748B",
          slateLight: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(0, 102, 255, 0.3)",
        glowCyan: "0 0 20px -5px rgba(0, 210, 255, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;
