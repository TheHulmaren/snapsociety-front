/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,vue}", "./index.html"],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        "main": "#FF8440",
        "main-light": "#FF8440",
        "text-dark": "#1D1D1D",
        "back": "#f9f9f9",
        "back-gray": "#eaeaea",
        "stroke-light": "#EDEFF1",
        "stroke-mid": "#B0B0B0",
        "button-back-light": "#F6F7F8",
        "text-searchbar": "#878A8C",
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '0.5': '0.5px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    }
  },
  plugins: [],
}

