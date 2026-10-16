/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primária: Azul-Marinho Profundo ─────────────────────────
        navy: {
          950: '#091B33',
          900: '#0F2A4A', // ⭐ Cor primária da marca
          800: '#163568',
          700: '#1E4380',
          600: '#2D5A96',
          500: '#3B6AA6',
          100: '#E8EEF5',
          50:  '#F0F4F9',
        },
        // ── Destaque: Âmbar / Dourado ────────────────────────────────
        gold: {
          900: '#6B4E10',
          700: '#A07520',
          600: '#B5862A',
          500: '#C9952A', // ⭐ Cor de destaque (CTAs, detalhes)
          400: '#D9A840',
          300: '#E8BC60',
          200: '#F0D490',
          100: '#F8EDD0',
          50:  '#FDF8EC',
        },
        // ── Neutros Quentes ──────────────────────────────────────────
        warm: {
          50:  '#F8F5F0', // off-white quente — fundo alternado
          100: '#F0EDE8',
          200: '#E0DBD3',
          300: '#C8C2B8',
          400: '#9B9B8E',
          500: '#6B6B5E',
          600: '#4A4A40',
          700: '#3A3A32',
          800: '#2A2A24',
          900: '#1A1A14', // texto principal
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        DEFAULT: '10px',
        md:  '10px',
        lg:  '16px',
        xl:  '24px',
        '2xl': '32px',
      },
      boxShadow: {
        card:    '0 2px 16px 0 rgba(15,42,74,0.08)',
        'card-hover': '0 8px 32px 0 rgba(15,42,74,0.14)',
        header:  '0 1px 0 0 #E0DBD3',
        input:   '0 0 0 3px rgba(201,149,42,0.2)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
