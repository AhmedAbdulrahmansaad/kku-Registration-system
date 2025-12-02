/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // King Khalid University Official Colors
        primary: {
          50: '#e8f5ec',
          100: '#c5e6ce',
          200: '#9ed5ae',
          300: '#77c48e',
          400: '#59b776',
          500: '#3baa5e',
          600: '#359b54',
          700: '#2d8848',
          800: '#184A2C', // Main KKU Green
          900: '#0f3a1f',
          950: '#082613',
        },
        secondary: {
          50: '#fdf9e9',
          100: '#faf0c7',
          200: '#f5e4a1',
          300: '#efd77a',
          400: '#e8c84d',
          500: '#D4AF37', // KKU Gold
          600: '#b8962e',
          700: '#977a25',
          800: '#775f1c',
          900: '#5d4a16',
          950: '#3d3010',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

