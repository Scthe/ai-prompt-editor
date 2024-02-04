/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', '!./node_modules'],
  theme: {
    extend: {},
  },
  // CAREFUL! Be specific with regexes!
  // https://github.com/tailwindlabs/tailwindcss/issues/8845#issuecomment-1184569469
  safelist: [
    {
      pattern: /(^text|outline|bg|border|shadow)-[a-z]+-\d+$/,
      variants: ['hover', 'focus', 'active', 'group-hover', 'before'],
    },
    /*
    {
      pattern: /(^h|w)-\d+$/,
    },
    */
  ],
  plugins: [],
};
