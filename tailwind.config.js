/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Adjust these globs to where your files are!
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // For Next.js apps:
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add your custom theme extensions here if needed
      colors: {
        primary: "#174377",
        secondary: "#C1272D",
        tertiary: "#F5B041",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    // Add official plugins here (if needed):
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/line-clamp'),
  ],
  darkMode: "class", // or "media" or false
}
