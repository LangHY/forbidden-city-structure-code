import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variables 集成
        bg: 'var(--color-bg)',
        accent: 'var(--color-accent)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'text-muted': 'var(--color-text-muted)',

        // 保留原有故宫主题色
        'forbidden-red': '#C43232',
        'forbidden-yellow': '#FFB944',
        'forbidden-green': '#2F6F7D',
        'palace-gray': '#8B8B8B',
        'paper-beige': '#F5F1E8',
        'stone-blue': '#4A6FA5',
        'cinnabar-red': '#B94E48',
        'gold-leaf': '#D4AF37',
        'ink-black': '#2C2C2C',
        'jade-green': '#5F9EA0',
        'coral-red': '#FF6F61',
        'royal-purple': '#6B4C9A',
      },
      fontFamily: {
        songti: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        kai: ['"Noto Serif CJK SC"', '"KaiTi"', '"STKaiti"', 'serif'],
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-texture.jpg')",
        'palace-pattern': "url('/textures/palace-pattern.png')",
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-custom': 'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
