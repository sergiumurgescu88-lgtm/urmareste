/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#fafafa',
        surface: '#ffffff',
        primary: '#c8a96e',
        primaryDark: '#a8894e',
        primaryLight: '#e8c98e',
        text: '#1a1a1a',
        textLight: '#6b7280',
        accent: '#6366f1',
        accentLight: '#818cf8',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px rgba(200, 169, 110, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
