/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    extend: {
        colors: {
            "vs-dark": "#3c3c3c"
        }
    },
  },
  plugins: [],
};
