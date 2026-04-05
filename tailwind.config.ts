import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal color system
        terminal: {
          bg: "#0d1117",
          surface: "#161b22",
          window: "#1a1a2e",
          border: "#30363d",
        },
        git: {
          green: "#00ff88",
          "green-dim": "#238636",
          "green-muted": "#1a4731",
          blue: "#58a6ff",
          "blue-dim": "#1f6feb",
          orange: "#f0883e",
          red: "#ff7b72",
          purple: "#d2a8ff",
          yellow: "#e3b341",
        },
        text: {
          primary: "#e6edf3",
          secondary: "#c9d1d9",
          muted: "#8b949e",
          faint: "#484f58",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        "scan-line": "scanline 8s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "draw-line": "drawLine 1.5s ease-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
        "terminal-boot": "terminalBoot 0.3s ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        glow: {
          "0%": { textShadow: "0 0 4px #00ff88, 0 0 8px #00ff88" },
          "100%": { textShadow: "0 0 8px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff8844" },
        },
        terminalBoot: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        terminal: "0 0 0 1px #30363d, 0 8px 32px rgba(0,0,0,0.6)",
        "terminal-green": "0 0 0 1px #238636, 0 0 20px rgba(0,255,136,0.1)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px #30363d",
        glow: "0 0 20px rgba(0,255,136,0.3)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(48,54,61,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(48,54,61,0.3) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
