/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{hbs, ts}"],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '2800px'
    },
    extend: {
      colors: {
      },
    },
  },
  plugins: [
    require('tailwindcss'),
  ],
}