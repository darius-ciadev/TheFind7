/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // enable dark mode with 'class'
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#000000",
        primary: "#212F54",
        background: "#F3F0ED",
        accent: "#00FFAE",
        neutral: "#6F7689",
        primaryVar: "hsl(var(--primary))",
        backgroundVar: "hsl(var(--background))",
        accentVar: "hsl(var(--accent))",
        neutralVar: "hsl(var(--neutral))",
      },

      borderRadius: {
        lg: "12px",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
