import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gallery: {
          alabaster: "#FAF9F6",
          charcoal: "#1E293B",
          obsidian: "#0B0F17",
          gold: "#C5A059",
          "gold-light": "#E5C88A",
          "gold-dark": "#9E7D3B",
          muted: "#64748B",
          surface: "#FFFFFF",
          "surface-dark": "#161E2E",
          border: "#E2E8F0",
          "border-dark": "#243044",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-lexend)", "Inter", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
