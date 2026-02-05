/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Sans"', 'sans-serif'],
        glitz: ['"Glitz"', 'sans-serif'],
        figtree: ['"Figtree"', 'sans-serif'],
        mozilla: ['"Fira Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#0047AB', // Royal Blue
        secondary: '#FF00FF', // Magenta
        tertiary: '#00235E', // Navy Blue
        surface: '#FFFFFF',
        'surface-dim': '#F5F5F7',
        'surface-container': '#E8EAF6',
        'on-surface': '#00235E',
        glass: 'rgba(255, 255, 255, 0.08)',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15)',
        'elevation-2': '0 1px 2px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15)',
        'elevation-3': '0 4px 8px rgba(0,0,0,0.3), 0 6px 20px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #f5f7ff 0%, #edf0fe 100%)',
        // Extracted from .bg-mesh
        'mesh-gradient': `
          radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
          radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
          radial-gradient(at 100% 0%, hsla(300, 49%, 40%, 1) 0, transparent 50%),
          radial-gradient(at 50% 100%, hsla(225, 39%, 30%, 1) 0, transparent 50%)
        `,
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        mesh: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)' },
        },
        cardStack: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        mesh: 'mesh 15s ease infinite',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'card-stack': 'cardStack 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
}
