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
        background: "#0c1511",
        foreground: "#dbe5de",
        surface: {
          DEFAULT:  "#1a241f",
          bright:   "#232c27",
          dim:      "#0c1511",
          lowest:   "#07100c",
          low:      "#141d19",
          standard: "#1a241f",
          high:     "#232c27",
          highest:  "#2d3732",
        },
        primary: {
          DEFAULT:   "#8fd4b9",
          container: "#5a9e85",
          fixed:     "#a1d1b9",
        },
        kinetic:        "#8fd4b9",
        "verdant-primary": "#8fd4b9",
        accent: {
          violet:  "#a4d0bc",
          emerald: "#8fd4b9",
          amber:   "#a1d1b9",
          rose:    "#93000a",
          cyan:    "#a4d0bc",
          purple:  "#8fd4b9",
        },
      },
      fontFamily: {
        sans:    ["var(--font-manrope)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "task-complete": "task-complete 0.5s ease-out forwards",
        "fade-in":       "fade-in 0.3s ease-out",
        "slide-up":      "slide-up 0.4s ease-out",
        "float":         "float 3s ease-in-out infinite",
        "gradient":      "gradient-shift 4s ease infinite",
        "pulse-ring":    "pulse-ring 1.5s ease-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
      },
      keyframes: {
        "task-complete": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "50%":  { transform: "scale(1.05)", opacity: "0.8" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
      boxShadow: {
        "glow-violet":  "0 0 30px rgba(143,212,185,0.2), 0 0 60px rgba(143,212,185,0.05)",
        "glow-emerald": "0 0 30px rgba(143,212,185,0.2), 0 0 60px rgba(143,212,185,0.05)",
        "glow-amber":   "0 0 30px rgba(143,212,185,0.2), 0 0 60px rgba(143,212,185,0.05)",
        "glow-rose":    "0 0 30px rgba(143,212,185,0.2), 0 0 60px rgba(143,212,185,0.05)",
        "card":         "0 40px 60px rgba(0,33,23,0.06)",
        "ambient":      "0 40px 60px rgba(0,33,23,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
