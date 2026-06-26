import type { Config } from 'tailwindcss';

/**
 * Design tokens extracted verbatim from the Claude Design prototype
 * (design_extract/…standalone-src.dc.html). This is the styling source of truth.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        bg: '#0E0B1A',
        ink: '#F4EFE6', // primary text
        // Muted text ramp
        muted: '#A89FB8',
        'muted-2': '#6f6685',
        'muted-3': '#C9C0DA',
        // Gold accent
        gold: '#E6B45A',
        'gold-hi': '#F2D49A',
        // Lines / surfaces
        line: '#2C2440',
        surface: '#171327',
        'surface-2': '#1E1830',
        'surface-3': '#1b1530',
        'surface-4': '#221b36',
      },
      fontFamily: {
        // Wired to next/font CSS variables (see app/layout.tsx).
        serif: ['var(--font-frank)', 'Georgia', 'serif'],
        sans: ['var(--font-heebo)', 'system-ui', 'sans-serif'],
        card: ['var(--font-card)', 'var(--font-frank)', 'cursive'],
      },
      backgroundImage: {
        'app-radial':
          'radial-gradient(120% 80% at 50% -10%, #1a1430 0%, #0E0B1A 60%)',
      },
      boxShadow: {
        card: '0 28px 46px -16px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.04)',
        'card-drag':
          '0 50px 70px -24px rgba(0,0,0,.85), 0 0 34px -6px rgba(230,180,90,.4)',
        gold: '0 8px 24px -8px rgba(230,180,90,.5)',
      },
      keyframes: {
        amtFade: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        amtPromptIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fade: 'amtFade .4s ease both',
        'fade-fast': 'amtFade .35s ease both',
        'prompt-in': 'amtPromptIn .25s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
