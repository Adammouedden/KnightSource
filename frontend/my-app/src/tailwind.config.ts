import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add UCF-specific colors here
        'ucf-gold': '#FFC904',
        'ucf-black': '#000000',
      }
    },
  },
  plugins: [],
};
export default config;