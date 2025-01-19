/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        max: 2147483647,
      },
    },
  },
  plugins: [],
}
