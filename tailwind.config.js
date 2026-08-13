/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0E7C86",
          dark: "#0B636B",
          light: "#12909C",
        },
        sky: {
          DEFAULT: "#3EC1E0",
        },
        pastel: {
          pink: "#FADBD8",
          pinkText: "#C0392B",
          green: "#D9F2E6",
          greenText: "#1E8A5F",
          blue: "#DBEFFA",
          blueText: "#1B6FA8",
        },
        ink: {
          DEFAULT: "#1E2A32",
          soft: "#8A94A6",
          faint: "#B8C0CC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(14, 124, 134, 0.10)",
        card: "0 8px 24px rgba(30, 42, 50, 0.08)",
        lift: "0 16px 40px rgba(30, 42, 50, 0.14)",
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220,38,38,0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(220,38,38,0)" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        shake: "shake 0.4s ease-in-out",
        "pulse-red": "pulse-red 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
