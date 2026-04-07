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
        background: "#080b14",
        foreground: "#e8eaf6",
        surface: {
          DEFAULT:  "#111829",
          bright:   "#172035",
          dim:      "#080b14",
          lowest:   "#050810",
          low:      "#0d1120",
          standard: "#111829",
          high:     "#172035",
          highest:  "#1e2a42",
        },
        primary: {
          DEFAULT:   "#818cf8",
          container: "#312e81",
          fixed:     "#a5b4fc",
        },
        kinetic:        "#818cf8",
        "verdant-primary": "#34d399",
        accent: {
          violet:  "#818cf8",
          emerald: "#34d399",
          amber:   "#fbbf24",
          rose:    "#fb7185",
          cyan:    "#22d3ee",
          purple:  "#c084fc",
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
        "glow-violet":  "0 0 30px rgba(129,140,248,0.35), 0 0 60px rgba(129,140,248,0.15)",
        "glow-emerald": "0 0 30px rgba(52,211,153,0.35), 0 0 60px rgba(52,211,153,0.15)",
        "glow-amber":   "0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(251,191,36,0.15)",
        "glow-rose":    "0 0 30px rgba(251,113,133,0.35), 0 0 60px rgba(251,113,133,0.15)",
        "card":         "0 4px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
