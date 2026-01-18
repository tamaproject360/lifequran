/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/tailwind")],
  theme: {
    extend: {
      colors: {
        // LifeQuran Design System Colors
        primary: {
          emerald: '#22C55E',
          DEFAULT: '#22C55E',
        },
        midnight: {
          emerald: '#022C22',
          DEFAULT: '#022C22',
        },
        celestial: {
          mint: '#ADFFD8',
          DEFAULT: '#ADFFD8',
        },
        muted: {
          gold: '#D4AF37',
          DEFAULT: '#D4AF37',
        },
        canvas: {
          pure: '#FFFFFF',
          DEFAULT: '#FFFFFF',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi'],
        'instrument-serif': ['InstrumentSerif'],
      },
      animation: {
        'wave-pulse': 'wave-pulse 8s ease-in-out infinite',
        'fade-slide': 'fade-slide 0.3s ease-out',
        'stagger-in': 'stagger-in 0.05s ease-out',
      },
      keyframes: {
        'wave-pulse': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.1)' },
        },
        'fade-slide': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'stagger-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
