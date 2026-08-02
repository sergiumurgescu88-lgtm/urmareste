/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        primary: '#c8a96e',
        primaryLight: '#e8c98e',
        surface: '#121212',
        surfaceLight: '#1a1a1a',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
