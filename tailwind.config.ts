import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial Narrow", "Arial", "sans-serif"],
      },
      colors: {
        background: "#E1E5E9",
        dark: "#2C2C2C",
        light: "#656565",
        accent: "#4b8b6a"
      },
      backgroundColor: {
        DEFAULT: "#E1E5E9",
      },
    },
  },
  plugins: [],
};
export default config;
