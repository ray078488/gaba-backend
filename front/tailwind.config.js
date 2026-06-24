/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4f4f7',
          100: '#e9e9f0',
          200: '#d7d7e5',
          300: '#bbb9d4',
          400: '#9b97be',
          500: '#7a76a5',
          600: '#615c8e',
          700: '#4c4873',
          800: '#3a3759',
          900: '#2b2943',
          950: '#1a182a',
        }
      }
    },
  },
  plugins: [],
}
