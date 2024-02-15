/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark-theme'],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', '!./node_modules'],
  theme: {
    extend: {
      colors: ({ colors }) => {
        const accentFromCssVariables = Object.fromEntries(
          Object.entries(colors.sky).map(([k, v]) => [
            k,
            `var(--clr_accent_${k}, ${v})`,
          ])
        );

        const accent = accentFromCssVariables;

        return {
          accent,
          focused: colors.pink[500],
          page: {
            light: colors.gray[300],
            dark: '#262626',
          },
          content: {
            light: '#131313',
            dark: '#f8fafb',
          },
          card: {
            light: colors.white,
            dark: '#353535',
          },
          // used for blue background tint on hover
          interactive: {
            light: accent[200],
            dark: accent[700],
          },
          // everthing that raises above card e.g. pills
          elevated: {
            light: colors.gray[200],
            dark: colors.gray[800],
          },
        };
      },
    },
  },
  // CAREFUL! Be specific with regexes!
  // https://github.com/tailwindlabs/tailwindcss/issues/8845#issuecomment-1184569469
  safelist: [
    {
      pattern: /(^text|outline|bg|border|shadow)-[a-z]+-\d+$/,
      variants: ['hover', 'focus', 'active', 'group-hover', 'before'],
    },
  ],
  plugins: [],
};
