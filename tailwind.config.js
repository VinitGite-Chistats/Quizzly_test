/** @type {import('tailwindcss').Config} */
// tailwind.config.js
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#3287E7",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
};
