module.exports = {
  content: [
    "./index.html",
    "./**/*.html",
    "./js/**/*.js",
    "./css/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        midnight: { 900: "#020617", 800: "#0f172a" },
        fox: { orange: "#FF8C42", gold: "#F59E0B" },
      },
      fontFamily: {
        fantasy: ["Cinzel", "serif"],
        script: ["Pinyon Script", "cursive"],
        body: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
