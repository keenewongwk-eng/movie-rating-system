/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#1a1a1a",
      },
      animation: {
        float: "float 10s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "50%": {
            transform: "translate(20px, -20px) scale(1.1)",
          },
        },
      },
    },
  },
  plugins: [],
};
