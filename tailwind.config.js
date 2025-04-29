/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors:{
            "Black": "#1E28320",
            "primaryBG": "#1e28320d",
        },
        fontFamily: {
          'primary': ["Roboto", "sans-serif"],
        },
      },
    },
    plugins: [],
  };
  