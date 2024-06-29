/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B7CE63",
        accent: "#4B5842",
        primaryDark: "#8FB339",
        accentDark: "#C7D59F",
        third: "#DADDD8"

      },
      fontFamily: {
        'sans': ["PilcrowRounded", "system-ui"]
      }
    },
  },
  plugins: [],
}
