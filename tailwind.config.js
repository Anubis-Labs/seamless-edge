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
          offwhite: '#EFEAD8',
          softgray: '#D0C9C0',
          warmtaupe: '#A27B5C',
          charcoal: '#36454F',
        },
        accent: {
          navy: '#1e3a5f',
          forest: '#2e4f3e',
          sage: '#5F7161',
          moss: '#6D8B74',
          gold: '#E5C687',
          terracotta: '#C8553D',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Work Sans', 'DM Sans', 'sans-serif'],
        body: ['Lora', 'Inter', 'serif'],
      },
      boxShadow: {
        subtle: '0 4px 6px rgba(0, 0, 0, 0.05)',
        warm: '0 8px 15px rgba(162, 123, 92, 0.1)',
        gold: '0 5px 15px rgba(229, 198, 135, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
} 