const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: 'class',
  content: [
    './node_modules/shadcn-ui/**/*.js',
    './main-src/**/*.{html,js,ts,jsx,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default sans-serif font
      },
    },
  },
}