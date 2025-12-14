/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0891b2", // A nice cyan color
        "background-light": "#f8fafc", // A very light gray (slate-50) for light mode
        "background-dark": "#0f172a", // A dark blue-gray (slate-900) for dark mode
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem", // 8px
      },
    },
  },
  plugins: [],
}
