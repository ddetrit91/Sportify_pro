import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          DEFAULT: "#d4ff00",
          50: "#fcffe5",
          100: "#f7ffc2",
          200: "#eeff8a",
          300: "#e0ff47",
          400: "#d4ff00",
          500: "#bbf200",
          600: "#91c200",
          700: "#6c9100",
          800: "#557004",
          900: "#475e08",
          glow: "rgba(212, 255, 0, 0.35)",
        },
        void: {
          DEFAULT: "#08090b",
          pure: "#050607",
          surface: "#0f1216",
          card: "#15191f",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "#1b2028",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
