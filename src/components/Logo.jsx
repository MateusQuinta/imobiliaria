/**
 * Logo.jsx — Logotipo Oficial da Viva Belle Imobiliária
 *
 * Reproduz com fidelidade vetorial o design da marca:
 * - Telhado arquitetônico com janela de 4 painéis
 * - Fita / onda dourada fluida inferior
 * - "VIVA" em tipografia elegante contrastante
 * - "BELLE" em degradê metálico dourado
 * - Subtítulo "— IMOBILIÁRIA —"
 * - Slogan opcional: "Seu novo capítulo começa aqui"
 */

import React from 'react'

/** Definição dos degradês dourados metálicos para SVG */
export function GoldGradients({ idPrefix = 'vb' }) {
  return (
    <defs>
      {/* Degradê dourado metálico principal */}
      <linearGradient id={`${idPrefix}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ECC870" />
        <stop offset="25%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#F5DC92" />
        <stop offset="75%" stopColor="#C59B27" />
        <stop offset="100%" stopColor="#8C6514" />
      </linearGradient>

      {/* Degradê dourado suave para o telhado */}
      <linearGradient id={`${idPrefix}-roof`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A87A1E" />
        <stop offset="35%" stopColor="#ECC870" />
        <stop offset="70%" stopColor="#C59B27" />
        <stop offset="100%" stopColor="#8C6514" />
      </linearGradient>

      {/* Degradê da onda/fita */}
      <linearGradient id={`${idPrefix}-wave`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8C6514" />
        <stop offset="20%" stopColor="#C59B27" />
        <stop offset="50%" stopColor="#F5DC92" />
        <stop offset="80%" stopColor="#C59B27" />
        <stop offset="100%" stopColor="#A87A1E" />
      </linearGradient>
    </defs>
  )
}

/**
 * Símbolo da Casa + Janela de 4 painéis + Onda Dourada
 */
export function LogoSymbol({ size = 42, className = '' }) {
  const h = Math.round(size * 0.72)
  const id = `sym-${size}`

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <GoldGradients idPrefix={id} />

      {/* Telhado principal com espessura e chanfros */}
      <path
        d="M 12 55 L 70 12 L 128 55 L 121 60 L 70 21 L 19 60 Z"
        fill={`url(#${id}-roof)`}
      />
      {/* Sombra / faceta direita do telhado para profundidade 3D */}
      <path
        d="M 70 12 L 128 55 L 121 60 L 70 21 Z"
        fill="#8C6514"
        opacity="0.35"
      />

      {/* Janela de 4 painéis quadrados */}
      <g fill={`url(#${id}-gold)`}>
        <rect x="58" y="32" width="10" height="10" rx="0.75" />
        <rect x="72" y="32" width="10" height="10" rx="0.75" />
        <rect x="58" y="46" width="10" height="10" rx="0.75" />
        <rect x="72" y="46" width="10" height="10" rx="0.75" />
      </g>

      {/* Onda / fita dourada fluida inferior */}
      <path
        d="M 6 68 
           C 28 56, 52 58, 75 67 
           C 95 75, 116 73, 134 59 
           C 126 68, 102 78, 80 73 
           C 56 67, 32 66, 6 78 Z"
        fill={`url(#${id}-wave)`}
      />
    </svg>
  )
}

/**
 * Logotipo Completo Viva Belle
 * 
 * @param {boolean} dark       - true quando renderizado em fundo escuro (texto VIVA branco)
 * @param {'sm'|'md'|'lg'|'xl'} size - Escala geral do logo
 * @param {'horizontal'|'stacked'} layout - 'horizontal' (ideal para header) ou 'stacked' (como na imagem original)
 * @param {boolean} withTagline - Exibe o slogan manuscrito "Seu novo capítulo começa aqui"
 */
export function LogoWordmark({
  dark = false,
  size = 'md',
  layout = 'horizontal',
  withTagline = false,
  className = '',
}) {
  const isDark = dark
  const vivaColor = isDark ? '#FFFFFF' : '#1A1D20'
  const subColor = isDark ? 'rgba(255,255,255,0.65)' : '#4A4A40'
  const lineColor = isDark ? 'rgba(255,255,255,0.25)' : '#D0C8B8'
  const goldColor = '#C9952A'

  // Presets de tamanho
  const scales = {
    sm: { symbol: 32, title: 18, sub: 7.5, tag: 11, gap: 10 },
    md: { symbol: 42, title: 23, sub: 9,   tag: 12, gap: 12 },
    lg: { symbol: 64, title: 34, sub: 12,  tag: 15, gap: 16 },
    xl: { symbol: 88, title: 46, sub: 15,  tag: 18, gap: 20 },
  }
  const s = scales[size] || scales.md

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Símbolo no topo */}
        <LogoSymbol size={s.symbol * 1.5} />

        {/* Nome VIVA BELLE */}
        <div className="flex items-baseline justify-center tracking-wider mt-1" style={{ gap: '0.35em' }}>
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: s.title * 1.25,
              color: vivaColor,
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            VIVA
          </span>
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#ECC870] to-[#A07520]"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: s.title * 1.25,
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            BELLE
          </span>
        </div>

        {/* Subtítulo — IMOBILIÁRIA — */}
        <div className="flex items-center justify-center gap-3 w-full mt-2" style={{ maxWidth: s.title * 8 }}>
          <span className="h-px flex-1" style={{ backgroundColor: lineColor }} />
          <span
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 500,
              fontSize: s.sub,
              color: subColor,
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            IMOBILIÁRIA
          </span>
          <span className="h-px flex-1" style={{ backgroundColor: lineColor }} />
        </div>

        {/* Tagline Cursiva */}
        {withTagline && (
          <p
            className="italic mt-2"
            style={{
              fontFamily: '"Playfair Display", Georgia, cursive',
              fontSize: s.tag,
              color: goldColor,
              letterSpacing: '0.02em',
            }}
          >
            Seu novo capítulo começa aqui
          </p>
        )}
      </div>
    )
  }

  // Layout Horizontal (padrão de header/navbar)
  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap }} aria-label="Viva Belle Imobiliária">
      <LogoSymbol size={s.symbol} />

      <div className="flex flex-col justify-center">
        {/* VIVA BELLE */}
        <div className="flex items-baseline leading-none" style={{ gap: '0.28em' }}>
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: s.title,
              color: vivaColor,
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            VIVA
          </span>
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#ECC870] to-[#A07520]"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: s.title,
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            BELLE
          </span>
        </div>

        {/* Linha e IMOBILIÁRIA */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-px w-4" style={{ backgroundColor: lineColor }} />
          <span
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 500,
              fontSize: s.sub,
              color: subColor,
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            IMOBILIÁRIA
          </span>
          <span className="h-px w-4" style={{ backgroundColor: lineColor }} />
        </div>
      </div>
    </div>
  )
}

export default LogoWordmark
