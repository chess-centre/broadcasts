const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-green-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-rose-400",
    "bg-teal-400",
    // Player avatar colors
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-purple-600",
    "bg-cyan-600",
    "bg-orange-600",
    "bg-indigo-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Lexend', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'xxxs': '.45rem',
        'xxs': '.6rem'
      },
      colors: {
        // GitHub Dark theme
        gh: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          btnPrimary: '#238636',
          btnDefault: '#21262d',
          btnDefaultBorder: '#363b42',
          text: '#c9d1d9',
          textMuted: '#8b949e',
          link: '#58a6ff',
        },
        // BRAND COLORS:
        yellow: {
          brand: "#ffd469"
        },
        orange: {
          brand: "#f0802b",
          flyer: "#f0802b",
          50: "#fff8f1",
          100: "#feecdc",
          200: "#fcd9bd",
          300: "#fdba8c",
          400: "#ff8a4c",
          500: "#ff5a1f",
          600: "#d03801",
          700: "#b43403",
          800: "#8a2c0d",
          900: "#771d1d",
        },
        teal: {
          brand: "#5699ab",
          50: "#edfafa",
          100: "#d5f5f6",
          200: "#afecef",
          300: "#7edce2",
          400: "#16bdca",
          500: "#0694a2",
          600: "#047481",
          700: "#036672",
          800: "#05505c",
          900: "#014451",
        },
        blue: {
          brand: "#0b2e3f",
          50: "#ebf5ff",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#a4cafe",
          400: "#76a9fa",
          500: "#3f83f8",
          600: "#1c64f2",
          700: "#1a56db",
          800: "#1e429f",
          900: "#233876",
        },
      },
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ],
};
