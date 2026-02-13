/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clinical-blue': '#0077b6',
        'clinical-light': '#caf0f8', // Light blue accent
        'clinical-dark': '#03045e', // Dark blue accent
        'clinical-gray': '#f8f9fa', // Background gray
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
