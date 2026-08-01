/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        society: {
          dark: '#080808',
          gold: '#c8a96e',
          goldLight: '#e8c98e',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
