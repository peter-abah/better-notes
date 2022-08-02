/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary) / <alpha-value>)",
        bg: "rgb(var(--bg) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        red: "rgb(var(--red) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "gray-1": "rgb(var(--gray-1) / <alpha-value>)",
        "gray-2": "rgb(var(--gray-2) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
