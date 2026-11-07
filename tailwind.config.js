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
        boss: {
          bg: '#08090C',
          surface: '#0E1017',
          card: '#141824',
          hover: '#1E2333',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(139, 92, 246, 0.5)',
          muted: '#8E9BB0',
          text: '#F3F4F6'
        },
        cyber: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          cyan: '#06B6D4',
          neonCyan: '#00F5FF',
          blue: '#3B82F6',
          electric: '#2563EB',
          emerald: '#10B981',
          gold: '#F59E0B',
          rose: '#F43F5E'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.7))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
