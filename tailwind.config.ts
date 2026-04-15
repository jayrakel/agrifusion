import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
      },
      colors: {
        green: {
          950: '#052E16',
        },
      },
      keyframes: {
        'fade-up':    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'float':      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'marquee':    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-dot':  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        'slide-in':   { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        'fade-up':   'fade-up 0.6s ease-out both',
        'float':     'float 6s ease-in-out infinite',
        'marquee':   'marquee 30s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'slide-in':  'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
