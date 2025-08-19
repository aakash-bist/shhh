/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFE5E5',
          blue: '#E5F3FF',
          green: '#E5FFE5',
          yellow: '#FFFEE5',
          purple: '#F3E5FF',
          orange: '#FFE8D1',
          mint: '#E5FFF5',
          lavender: '#F0E5FF'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      fontFamily: {
        'poetry': ['Georgia', 'serif'],
        'thought': ['Arial', 'sans-serif'],
        'confession': ['Courier New', 'monospace'],
        'artistic': ['Brush Script MT', 'cursive']
      }
    },
  },
  plugins: [],
}
