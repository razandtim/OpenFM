/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../apps/service/src/ui/**/*.{js,ts,jsx,tsx}',
    '../../apps/desktop/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#3A86FF',
        'mood-epic': '#FF6B6B',
        'mood-romantic': '#FFC6E7',
        'mood-funny': '#FFE08A',
        'mood-scary': '#B28DFF',
        'mood-sad': '#7EC8E3',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

