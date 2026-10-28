import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#FBFBFD',
          subtle: '#F5F5F7',
          card: '#FFFFFF',
          border: '#E5E5EA',
          borderSubtle: '#F2F2F7',
          text: '#1D1D1F',
          secondary: '#86868B',
          tertiary: '#AEAEB2',
          accent: '#0071E3',
          accentHover: '#0077ED',
          accentActive: '#0062C4',
          accentSubtle: 'rgba(0, 113, 227, 0.08)',
          gold: '#B8860B',
          goldBg: '#FFF9E6',
          goldBorder: '#F2DEAC',
          danger: '#FF3B30',
          dangerSubtle: 'rgba(255, 59, 48, 0.08)',
          success: '#34C759',
          successSubtle: 'rgba(52, 199, 89, 0.08)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-spotlight': '0 16px 40px -10px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        'apple-pill': '0 2px 6px rgba(0, 0, 0, 0.06)',
        'apple-float': '0 20px 48px rgba(0, 0, 0, 0.1)',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

