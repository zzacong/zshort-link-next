/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'avoid',
  singleQuote: true,
  tabWidth: 2,
  semi: false,
  printWidth: 100,
  plugins: [require('prettier-plugin-tailwindcss')],
}
