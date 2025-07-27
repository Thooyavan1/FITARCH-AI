/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./public/**/*.{html,js,ts,tsx,jsx}",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00b894",
        secondary: "#0984e3",
        danger: "#d63031",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        fitarch: "0 4px 24px 0 rgba(0,184,148,0.15)",
        "fitarch-lg": "0 8px 32px 0 rgba(9,132,227,0.15)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(.4,0,.2,1) both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
