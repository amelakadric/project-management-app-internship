/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/**/**/*.{html,js}", "./src/**/**/**/*.{html,js}", "./src/**/**/**/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#0097A7',
        dark: '#0097A7',
        secondary: '#00BCD4',
        tertiary: '#FAFAFA',
        darkBlue: '#0097A7',
        lightBlue: '#00BCD4',
        bgGray: '#FAFAFA'
      },
    },
  },
  plugins: [],
}

