// Sin esto, `@import "tailwindcss"` entra como CSS literal y no hay utilidades (0036)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
