import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Reds/Maroons
        crimson: {
          50: "#fdf5f5",
          100: "#f9e5e5",
          200: "#f0bebe",
          400: "#c05050",
          600: "#7A1418",
          800: "#5E0F12",
          900: "#3D0A0D",
        },
        // Teals
        teal: {
          50: "#f0f9f7",
          100: "#c8e8e4",
          200: "#90d1ca",
          400: "#3D9E8C",
          500: "#2F8474",
          600: "#2A6B60",
          800: "#1D4D45",
          900: "#10302B",
        },
        // Golds
        amber: {
          50: "#fdf8ec",
          100: "#f7e8bb",
          200: "#edd080",
          400: "#C9A030",
          600: "#B8860B",
          800: "#8A6408",
          900: "#5C4205",
        },
        // Slate/Inks
        slate: {
          50: "#FAF8F2",
          100: "#EDE8DF",
          200: "#C8BFB5",
          500: "#8A7B6F",
          600: "#4B4038",
          900: "#1C1916",
        },
        // Semantic
        red: {
          900: "#7A1418",
        },
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
        deva: ['Noto Serif Devanagari', 'serif'],
      },
      animation: {
        fadeUp: "fadeUp 380ms cubic-bezier(0.4, 0, 0.2, 1) both",
      },
      keyframes: {
        fadeUp: {
          from: {
            opacity: "0",
            transform: "translateY(18px)",
          },
          to: {
            opacity: "1",
            transform: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
