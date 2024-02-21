// eslint-disable-next-line @typescript-eslint/no-var-requires
const styleguide = require('@vercel/style-guide/prettier')

module.exports = {
  ...styleguide,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
}
