/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        condensed: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
      colors: {
        raw: {
          black: '#0A0A0A',
          white: '#FAFAFA',
          cream: '#EDE8DF',
          ink: '#1A1A1A',
          gray: '#6B6B6B',
          silver: '#C8C4BC',
          accent: '#C8A96E',
          red: '#C0392B',
          darkgray: '#2A2A2A',
          paper: '#FAFAFA',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.7s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      }
    },
  },
  plugins: [],
}
