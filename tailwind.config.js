const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': {
          900: '#292680',
          800: '#3532a7',
          700: '#6f6cd3',
          600: '#6f6cd3',
          400: '#6f6cd3',
        },
        'secondary': {
          900: '#1a1a2e',
          800: '#16213e',
          700: '#0f3460',
        },
        'accent': {
          400: '#e94560',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};