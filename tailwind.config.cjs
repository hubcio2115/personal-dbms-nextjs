/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  theme: {
    extend: {},
  },
  daisyui: {
    styled: true,
    themes: ['dark', 'light'],
    base: true,
    utils: true,
    rtl: false,
    prefix: '',
  },
};
