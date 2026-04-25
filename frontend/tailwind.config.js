/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        canvas: '#f7f8fc',
        night: '#07111f',
        sand: '#f7efe6',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 70px -32px rgba(18, 38, 63, 0.35)',
        soft: '0 18px 50px -28px rgba(35, 38, 52, 0.28)',
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(255,255,255,0.78), transparent 40%), radial-gradient(circle at bottom right, rgba(56,189,248,0.16), transparent 28%), radial-gradient(circle at 15% 20%, rgba(249,115,22,0.16), transparent 25%)",
      },
    },
  },
  plugins: [],
}
