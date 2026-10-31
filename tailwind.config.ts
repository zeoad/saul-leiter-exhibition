// Legacy Tailwind v3 configuration, kept for reference only.
// This project uses Tailwind CSS 4's CSS-first configuration: the design tokens
// live in `src/app/globals.css` under `@theme` and are imported with
// `@import "tailwindcss"`. This file is not loaded by the build.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EAE6DE",
        ink: "#24231F",
        muted: "#77736B",
        accent: "#A64B3C",
      },
    },
  },
  plugins: [],
};

export default config;