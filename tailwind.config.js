/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4ED',
          50: '#FCFAF7',
          100: '#F7F4ED',
          200: '#EFECE4',
          300: '#E5E0D5',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          light: '#4A4A4A',
          muted: '#6B6862',
          faint: '#9E9B95',
          dark: '#1C1C1C',
        },
        sage: {
          DEFAULT: '#7D8F7B',
          light: '#E9EDE8',
          subtle: '#D7DFD5',
          medium: '#6C7E6A',
          dark: '#51634F',
          border: '#C5D0C3',
        },
        parchment: {
          DEFAULT: '#E8E3D8',
          border: '#E2DCD0',
          hover: '#DDD6C8',
        },
        warmcard: {
          DEFAULT: '#FFFFFF',
          alt: '#FAF8F4',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(45, 45, 45, 0.04)',
        'medium': '0 4px 20px rgba(45, 45, 45, 0.07)',
        'elevated': '0 10px 30px rgba(45, 45, 45, 0.09)',
      }
    },
  },
  plugins: [],
}
