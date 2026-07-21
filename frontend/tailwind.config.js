/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Locked palette — Section 2 of the build guide. Do not add colors
        // here without updating the guide first.
        navy: {
          DEFAULT: '#0B2545',
          hover: '#14375E',
        },
        slate: '#5F5E5A',
        hairline: '#E4E2DA',
        success: '#3B6D11',
        warning: '#854F0B',
        danger: '#A32D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
