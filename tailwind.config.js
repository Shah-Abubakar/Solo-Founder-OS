/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#111111',
          surface: '#1a1a1a',
          hover: '#222222',
          active: '#2a2a2a',
          elevated: '#151515',
        },
        border: {
          DEFAULT: '#2a2a2a',
          hover: '#3a3a3a',
          active: '#4a4a4a',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#9a9a9a',
          muted: '#6a6a6a',
          inverse: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#7a7a7a',
          hover: '#8a8a8a',
          active: '#6a6a6a',
          subtle: 'rgba(122,122,122,0.1)',
        },
        brand: {
          DEFAULT: '#c0c0c0',
          accent: '#e0e0e0',
        },
        status: {
          success: '#4a9a6a',
          'success-bg': 'rgba(74,154,106,0.1)',
          warning: '#b08a4a',
          'warning-bg': 'rgba(176,138,74,0.1)',
          error: '#9a4a4a',
          'error-bg': 'rgba(154,74,74,0.1)',
          info: '#4a7a9a',
          'info-bg': 'rgba(74,122,154,0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
