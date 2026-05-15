/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        brand: {
          50:  '#fff8f0',
          100: '#ffecd6',
          200: '#ffd4a8',
          300: '#ffb570',
          400: '#ff8c35',
          500: '#ff6b0a',
          600: '#e85500',
          700: '#c04000',
          800: '#963200',
          900: '#7a2a00',
        },
        surface: {
          DEFAULT: '#0f0f0f',
          50:  '#1a1a1a',
          100: '#242424',
          200: '#2e2e2e',
          300: '#3a3a3a',
        }
      }
    },
  },
  plugins: [],
}
