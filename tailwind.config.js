/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom animations for weather effects
      animation: {
        // Smooth gradient background shift for dynamic weather mood
        'gradient-x': 'gradient-x 15s ease infinite',

        // Floating clouds (for partly cloudy, overcast)
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 10s ease-in-out infinite',

        // Falling rain animation (for drizzle, rain, showers)
        'rain': 'rain 1.5s linear infinite',

        // Drifting snow (for snow fall)
        'snow': 'snow 8s linear infinite',

        // Pulsing glow (for sun, thunderstorm, fog)
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'pulse-fast': 'pulse-fast 1.2s ease-in-out infinite',
      },

      // Keyframe definitions
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-20px) rotate(10deg)', opacity: '0.7' },
          '100%': { transform: 'translateY(40px) rotate(10deg)', opacity: '0' },
        },
        snow: {
          '0%': { transform: 'translateY(-30px) rotate(0deg)', opacity: '0.9' },
          '100%': { transform: 'translateY(60px) rotate(360deg)', opacity: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'pulse-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}