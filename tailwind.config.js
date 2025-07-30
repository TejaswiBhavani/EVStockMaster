/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdff',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        electric: {
          400: '#00f2fe',
          500: '#4facfe',
          600: '#00d4ff',
        },
        dark: {
          900: '#0f2027',
          800: '#203a43',
          700: '#2c5364',
          600: '#3d5a73',
          500: '#4e6b82',
          400: '#5f7c91',
          300: '#708da0',
          200: '#819eaf',
          100: '#92afbe',
          50: '#a3c0cd',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}