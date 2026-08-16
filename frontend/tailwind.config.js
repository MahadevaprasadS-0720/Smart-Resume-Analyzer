/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oceanic: {
          950: '#0B132B',
          900: '#0F172A',
          850: '#141D38',
          800: '#1C2541',
          700: '#3A506B',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
        },
        neon: {
          cyan: '#00F5D4',
          blue: '#06B6D4',
          electric: '#3B82F6',
          violet: '#7209B7',
          magenta: '#F72585',
          coral: '#FF007F',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -3px rgba(0, 245, 212, 0.45), 0 0 10px -2px rgba(6, 182, 212, 0.3)',
        'blue-glow': '0 0 25px -3px rgba(59, 130, 246, 0.45)',
        'magenta-glow': '0 0 25px -3px rgba(247, 37, 133, 0.45)',
        'violet-glow': '0 0 25px -3px rgba(114, 9, 183, 0.45)',
        'emerald-glow': '0 0 25px -3px rgba(16, 185, 129, 0.45)',
        'card-navy': '0 10px 30px -10px rgba(11, 19, 43, 0.9), 0 1px 3px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 20px 40px -15px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(0, 245, 212, 0.35)',
      },
      animation: {
        'laser-sweep': 'laser-sweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'laser-sweep': {
          '0%': { top: '0%', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(135deg, #00F5D4 0%, #06B6D4 50%, #3B82F6 100%)',
        'cta-hover': 'linear-gradient(135deg, #00F5D4 0%, #3B82F6 50%, #7209B7 100%)',
        'hero-gradient': 'linear-gradient(135deg, #00F5D4 0%, #38BDF8 40%, #F72585 100%)',
        'sapphire-gradient': 'radial-gradient(ellipse at top, #1C2541 0%, #0B132B 70%)',
      },
    },
  },
  plugins: [],
}
