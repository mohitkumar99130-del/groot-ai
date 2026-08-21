/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        groot: {
          primary: '#1F6B45',
          dark: '#174F35',
          accent: '#F2B84B',
          bg: '#F6F8F2',
          surface: '#FFFFFF',
          soft: '#EDF4EC',
          text: '#1B2520',
          secondary: '#66756D',
          border: '#DDE6DD',
          success: '#2F7D4A',
          warning: '#C57A10',
          danger: '#B94742',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'Noto Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
