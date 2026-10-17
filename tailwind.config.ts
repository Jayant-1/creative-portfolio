import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ca: {
          surface: "var(--ca-surface, #fdfdfb)",
          ink: "var(--ca-ink, #191510)",
          gray: "var(--ca-gray, #857b69)",
          chrome: "var(--ca-chrome, #ece3d1)",
          tick: "var(--ca-tick, #c0b49d)",
          blue: "var(--ca-blue, #2b57d6)",
          cyan: "var(--ca-cyan, #b7c6ef)",
          yellow: "var(--ca-yellow, #f7c948)",
          "yellow-soft": "var(--ca-yellow-soft, #f3e2ad)",
          magenta: "var(--ca-magenta, #ff4d8d)",
          green: "var(--ca-green, #16b06a)",
          mint: "var(--ca-mint, #a9dfc6)",
          "pink-soft": "var(--ca-pink-soft, #ffc6da)",
          orange: "var(--ca-orange, #ff6a35)",
        },
      },
      fontFamily: {
        display: ["var(--font-artsy-display)", "Handjet", "monospace"],
        hand: ["var(--font-artsy-hand)", "'Just Me Again Down Here'", "cursive"],
        mono: ["var(--font-artsy-mono)", "'DM Mono'", "monospace"],
        sans: ["var(--font-artsy-sans)", "Inter", "system-ui", "sans-serif"],
        sixCap: ["'Six Caps'", "sans-serif"],
        bebasNeue: ["'Bebas Neue'", "sans-serif"],
        raleway: ["'Raleway'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "110": "27.5rem",
        "160": "40rem",
      },
      width: {
        "2xs": "18rem",
      },
      boxShadow: {
        solid: "8px 12px 0 var(--ca-ink, #191510)",
        "solid-sm": "4px 4px 0 var(--ca-ink, #191510)",
        "solid-yellow": "5px 5px 0 var(--ca-yellow, #f7c948)",
        tactile: "0 12px 24px rgba(25, 21, 16, 0.16)",
        badge: "1.5px 1.5px 0 rgba(25, 21, 16, 0.28)",
      },
      backdropBlur: {
        xs: "2px",
      },
      blur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
