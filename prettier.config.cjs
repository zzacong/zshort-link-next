/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'avoid',
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
