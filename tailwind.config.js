/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'font-sans'
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          offwhite: '#f8f7f4',
          softgray: '#e5e5e5',
          warmtaupe: '#b8afa6',
        },
        accent: {
          navy: '#1e3a5f',
          forest: '#2e4f3e',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Work Sans', 'DM Sans', 'sans-serif'],
        body: ['Lora', 'Inter', 'serif'],
      },
      boxShadow: {
        subtle: '0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
} 