/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DevGuard AI dark developer-tool palette
        bg: {
          primary:   '#0d1117',   // main background
          secondary: '#161b22',   // card/panel background
          tertiary:  '#21262d',   // input/hover background
          border:    '#30363d',   // borders
        },
        accent: {
          blue:   '#58a6ff',
          green:  '#3fb950',
          yellow: '#d29922',
          red:    '#f85149',
          purple: '#bc8cff',
          orange: '#f0883e',
        },
        text: {
          primary:   '#e6edf3',
          secondary: '#8b949e',
          muted:     '#484f58',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
