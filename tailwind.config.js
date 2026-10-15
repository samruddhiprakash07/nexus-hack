/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121214',
        card: '#1A1A1E',
        'card-subtle': '#222228',
        'card-hover': '#26262E',
        'border-custom': '#2E2E38',
        'border-light': '#3F3F4E',
        purple: {
          soft: '#A855F7',
          deep: '#7E22CE',
          lavender: '#E9D5FF',
          glow: 'rgba(168, 85, 247, 0.25)',
        },
        muted: '#9CA3AF',
        charcoal: {
          950: '#0E0E10',
          900: '#121214',
          800: '#1A1A1E',
          700: '#26262E',
          600: '#32323D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.3)',
        'glow-purple-sm': '0 0 15px -3px rgba(168, 85, 247, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'scan-line': 'scan 2.2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0.8' },
          '100%': { top: '92%', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
