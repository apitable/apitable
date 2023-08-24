/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'vk-',
  darkMode: ['class'],
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('@tailwindcss/typography')],
};
