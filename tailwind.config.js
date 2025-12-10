module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A9D8F",
        dark: "#264653",
        accent: "#FFB703",
        danger: "#E76F51"
      },
      borderRadius: {
        'xl2': '1.25rem',
      }
    },
  },
  plugins: [],
}
