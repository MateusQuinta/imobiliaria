/**
 * StyleGuide.jsx — Guia de Identidade Visual da Áurea Imóveis
 *
 * Este documento é a entrega da Etapa 1: identidade visual completa.
 * Seções:
 *   1. Marca — conceito, tom de voz, tagline
 *   2. Logotipo — variações e usos
 *   3. Paleta de Cores — com click-to-copy
 *   4. Tipografia — escala completa
 *   5. Componentes — botões, inputs, cards, badges, tags
 *   6. Variáveis CSS — referência do desenvolvedor
 */

import { useState } from 'react'
import { LogoSymbol, LogoWordmark } from '../components/Logo'

// ─── ÍCONES SVG INLINE ────────────────────────────────────────────────────────
const Icon = {
  Bed: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M22 4v16"/><path d="M2 8h20"/><path d="M2 16h20"/>
      <path d="M6 8v8"/><rect x="6" y="10" width="4" height="4" rx="1"/>
    </svg>
  ),
  Car: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <rect x="7" y="14" width="10" height="6" rx="1"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
    </svg>
  ),
  Ruler: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20L20 2"/><path d="m7 19 3-3"/><path d="m12 14 3-3"/><path d="m17 9 3-3"/>
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#C9952A' : 'none'} stroke={filled ? '#C9952A' : 'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9952A" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
}

// ─── PALETA DE CORES ───────────────────────────────────────────────────────────
const PALETTE = {
  primary: [
    { name: 'Navy 950', hex: '#091B33', var: '--color-navy-950', tw: 'bg-navy-950', use: 'Fundos ultra-escuros, hero dark' },
    { name: 'Navy 900', hex: '#0F2A4A', var: '--color-navy-900', tw: 'bg-navy-900', use: '⭐ Cor primária — headers, texto' },
    { name: 'Navy 800', hex: '#163568', var: '--color-navy-800', tw: 'bg-navy-800', use: 'Hover de elementos navys' },
    { name: 'Navy 700', hex: '#1E4380', var: '--color-navy-700', tw: 'bg-navy-700', use: 'Botão secondary hover' },
    { name: 'Navy 600', hex: '#2D5A96', var: '--color-navy-600', tw: 'bg-navy-600', use: 'Links, badges, focus rings' },
    { name: 'Navy 100', hex: '#E8EEF5', var: '--color-navy-100', tw: 'bg-navy-100', use: 'Fundo de hover sutil em navy' },
  ],
  accent: [
    { name: 'Gold 700', hex: '#A07520', var: '--color-gold-700', tw: 'bg-gold-700', use: 'Pressed state de CTAs' },
    { name: 'Gold 600', hex: '#B5862A', var: '--color-gold-600', tw: 'bg-gold-600', use: 'Hover de botões de destaque' },
    { name: 'Gold 500', hex: '#C9952A', var: '--color-gold-500', tw: 'bg-gold-500', use: '⭐ Destaque — CTAs, detalhes' },
    { name: 'Gold 400', hex: '#D9A840', var: '--color-gold-400', tw: 'bg-gold-400', use: 'Estrelas, ícones de favorito' },
    { name: 'Gold 300', hex: '#E8BC60', var: '--color-gold-300', tw: 'bg-gold-300', use: 'Hover sutil em fundos claros' },
    { name: 'Gold 100', hex: '#F8EDD0', var: '--color-gold-100', tw: 'bg-gold-100', use: 'Fundo de seção com tom âmbar' },
  ],
  neutral: [
    { name: 'Branco',   hex: '#FFFFFF', var: '--color-white',    tw: 'bg-white',    use: 'Fundo principal' },
    { name: 'Warm 50',  hex: '#F8F5F0', var: '--color-warm-50',  tw: 'bg-warm-50',  use: '⭐ Fundo de seções alternadas' },
    { name: 'Warm 100', hex: '#F0EDE8', var: '--color-warm-100', tw: 'bg-warm-100', use: 'Cards, inputs, tooltips' },
    { name: 'Warm 200', hex: '#E0DBD3', var: '--color-warm-200', tw: 'bg-warm-200', use: 'Bordas, divisores' },
    { name: 'Warm 400', hex: '#9B9B8E', var: '--color-warm-400', tw: 'bg-warm-400', use: 'Placeholder, texto terciário' },
    { name: 'Warm 700', hex: '#3A3A32', var: '--color-warm-700', tw: 'bg-warm-700', use: 'Texto de corpo, parágrafos' },
    { name: 'Warm 900', hex: '#1A1A14', var: '--color-warm-900', tw: 'bg-warm-900', use: '⭐ Texto principal, máx. contraste' },
  ],
}

// ─── ESCALA TIPOGRÁFICA ───────────────────────────────────────────────────────
const TYPE_SCALE = [
  { label: 'Display XL',     size: 72, lh: 1.08, w: 700, family: 'serif', sample: 'O imóvel que você merece',          use: 'Hero principal' },
  { label: 'Display LG',     size: 56, lh: 1.10, w: 700, family: 'serif', sample: 'Imóveis em destaque',               use: 'Título de seção principal' },
  { label: 'Display MD',     size: 44, lh: 1.18, w: 600, family: 'serif', sample: 'Nossos diferenciais',               use: 'Subtítulo de seção' },
  { label: 'Display SM',     size: 34, lh: 1.25, w: 600, family: 'serif', sample: 'Apartamento nos Jardins',           use: 'Heading de página interna' },
  { label: 'Heading LG',     size: 28, lh: 1.30, w: 600, family: 'sans',  sample: 'R$ 1.850.000',                      use: 'Preços de destaque, subtítulos' },
  { label: 'Heading MD',     size: 22, lh: 1.38, w: 600, family: 'sans',  sample: 'Simule seu financiamento',          use: 'Heading de formulário, cards' },
  { label: 'Heading SM',     size: 18, lh: 1.45, w: 600, family: 'sans',  sample: 'Atendimento humano, do início ao fim.', use: 'Destaques de seção' },
  { label: 'Body LG',        size: 18, lh: 1.70, w: 400, family: 'sans',  sample: 'Encontre o imóvel ideal para você e sua família no Vale do Paraíba, com transparência e cuidado.', use: 'Texto hero, lead' },
  { label: 'Body MD',        size: 16, lh: 1.65, w: 400, family: 'sans',  sample: 'Com mais de 15 anos de mercado, a Áurea Imóveis conecta famílias paulistanas aos melhores imóveis de médio e alto padrão.', use: 'Parágrafos padrão' },
  { label: 'Body SM',        size: 14, lh: 1.60, w: 400, family: 'sans',  sample: '3 quartos · 2 vagas · 142 m² · Zona Sul',     use: 'Metadados, detalhes de card' },
  { label: 'Label / Overline', size: 11, lh: 1.4, w: 500, family: 'sans', sample: 'LANÇAMENTO EXCLUSIVO', use: 'Badges, overlines, rótulos de campo', ls: '0.13em', upper: true },
]

// ─── IMÓVEIS DE EXEMPLO (para o card component) ───────────────────────────────
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    type: 'VENDA',
    price: 'R$ 1.850.000',
    title: 'Apartamento Jardins',
    address: 'Rua Oscar Freire, Jardins',
    beds: 3, parking: 2, area: 142,
    tag: 'Alto Padrão',
  },
  {
    id: 2,
    type: 'ALUGUEL',
    price: 'R$ 8.500/mês',
    title: 'Cobertura Itaim Bibi',
    address: 'Rua Iguatemi, Itaim Bibi',
    beds: 4, parking: 3, area: 210,
    tag: 'Exclusivo',
  },
  {
    id: 3,
    type: 'LANÇAMENTO',
    price: 'A partir de R$ 920.000',
    title: 'Edifício Pinheiros',
    address: 'Rua Cardeal Arcoverde, Pinheiros',
    beds: 2, parking: 1, area: 78,
    tag: 'Lançamento',
  },
]

// ─── SUBCOMPONENTES DO STYLE GUIDE ────────────────────────────────────────────

/** Swatch de cor clicável com copy-to-clipboard */
function ColorSwatch({ c }) {
  const [copied, setCopied] = useState(false)
  const isLight = ['#FFFFFF','#F8F5F0','#F0EDE8','#E0DBD3','#F8EDD0','#E8EEF5'].includes(c.hex)
  const textOnSwatch = isLight ? '#3A3A32' : '#FFFFFF'

  function handleCopy() {
    navigator.clipboard.writeText(c.hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={handleCopy} title={`Clique para copiar ${c.hex}`}>
      {/* Swatch */}
      <div
        className="relative h-20 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-[1.03]"
        style={{
          backgroundColor: c.hex,
          border: isLight ? '1.5px solid #E0DBD3' : 'none',
        }}
      >
        <span
          className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1"
          style={{ color: textOnSwatch, fontFamily: 'monospace' }}
        >
          {copied ? <><Icon.Check /> Copiado!</> : <><Icon.Copy /> Copiar</>}
        </span>
      </div>
      {/* Info */}
      <div>
        <p className="text-xs font-mono font-semibold text-warm-900">{c.hex}</p>
        <p className="text-xs font-semibold text-warm-700 mt-0.5">{c.name}</p>
        <p className="text-xs text-warm-400 mt-0.5 leading-tight">{c.use}</p>
      </div>
    </div>
  )
}

/** Card de imóvel de exemplo */
function PropertyCard({ p }) {
  const [faved, setFaved] = useState(false)
  const badgeClass = p.type === 'VENDA' ? 'badge badge-venda' : p.type === 'ALUGUEL' ? 'badge badge-aluguel' : 'badge badge-lancamento'

  return (
    <div className="property-card">
      {/* Foto placeholder */}
      <div className="relative" style={{ aspectRatio: '4/3', background: '#E8EEF5' }}>
        {/* SVG placeholder de edifício */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 320 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="320" height="240" fill="#E8EEF5"/>
          {/* Prédio fundo */}
          <rect x="60" y="80" width="80" height="140" fill="#C8C2B8" rx="2"/>
          {/* Janelas prédio fundo */}
          {[0,1,2].map(r => [0,1,2].map(c2 => (
            <rect key={`${r}-${c2}`} x={72 + c2*22} y={92 + r*28} width="12" height="16" fill="#9B9B8E" rx="1"/>
          )))}
          {/* Prédio frente */}
          <rect x="160" y="60" width="100" height="160" fill="#9B9B8E" rx="2"/>
          {/* Janelas prédio frente */}
          {[0,1,2,3].map(r => [0,1,2].map(c2 => (
            <rect key={`f${r}-${c2}`} x={172 + c2*28} y={74 + r*30} width="16" height="20" fill="#6B6B5E" rx="1"/>
          )))}
          {/* Porta */}
          <rect x="196" y="196" width="28" height="24" fill="#4A4A40" rx="1"/>
          {/* Chão */}
          <rect x="0" y="218" width="320" height="22" fill="#C8C2B8"/>
          {/* Logo placeholder text */}
          <text x="160" y="36" textAnchor="middle" fill="#9B9B8E" fontSize="11" fontFamily="Inter, sans-serif">
            Foto do Imóvel
          </text>
        </svg>

        {/* Badge e favorito */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className={badgeClass}>{p.type}</span>
          <button
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
            onClick={() => setFaved(!faved)}
            aria-label={faved ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Icon.Heart filled={faved} />
          </button>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-5 flex flex-col gap-3">
        {/* Preço */}
        <p className="font-sans font-semibold text-navy-900" style={{ fontSize: 20 }}>{p.price}</p>

        {/* Título e endereço */}
        <div>
          <p className="font-serif font-semibold text-warm-900" style={{ fontSize: 16, lineHeight: 1.3 }}>{p.title}</p>
          <p className="text-xs text-warm-400 mt-1 flex items-center gap-1">
            <Icon.MapPin />{p.address}
          </p>
        </div>

        {/* Divisor */}
        <div className="border-t border-warm-100" />

        {/* Métricas */}
        <div className="flex items-center gap-4 text-warm-500 text-xs font-medium">
          <span className="flex items-center gap-1.5"><Icon.Bed />{p.beds} quartos</span>
          <span className="flex items-center gap-1.5"><Icon.Car />{p.parking} vagas</span>
          <span className="flex items-center gap-1.5"><Icon.Ruler />{p.area} m²</span>
        </div>

        {/* Botão */}
        <button className="btn btn-secondary w-full mt-1" style={{ fontSize: 13 }}>
          Ver detalhes
        </button>
      </div>
    </div>
  )
}

/** Cabeçalho de cada seção */
function SectionHeader({ num, title, subtitle }) {
  return (
    <div className="mb-12">
      <p className="text-xs font-sans font-semibold tracking-widest text-gold-500 uppercase mb-2">
        {String(num).padStart(2, '0')} — {title}
      </p>
      {subtitle && (
        <p className="text-warm-400 font-sans text-sm max-w-xl">{subtitle}</p>
      )}
    </div>
  )
}

// ─── STYLE GUIDE PAGE ─────────────────────────────────────────────────────────
export default function StyleGuide() {
  const [activeTab, setActiveTab] = useState(null) // unused for now — navegação lateral futura

  return (
    <div className="min-h-screen bg-white font-sans text-warm-900">

      {/* ──── NAV TOPO ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-warm-200">
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
          <LogoWordmark size="sm" />
          <span className="text-xs font-sans font-medium text-warm-400 tracking-wide uppercase">
            Guia de Identidade Visual · Etapa 1
          </span>
        </div>
      </header>

      {/* ──── CAPA ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 text-white px-6 py-28">
        <div className="max-w-content mx-auto">
          <div className="flex flex-col gap-8 max-w-2xl">
            <LogoWordmark size="xl" dark layout="stacked" withTagline={true} />
            <div className="border-l-2 border-gold-500 pl-6 mt-4">
              <p className="font-serif italic text-xl text-white/80 leading-relaxed">
                "Viva Belle — a celebração de viver com sofisticação, beleza e propósito. Conectamos famílias paulistanas ao cenário do seu próximo grande momento de vida."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              {['Confiável', 'Acolhedor', 'Sofisticado'].map(word => (
                <div key={word} className="flex flex-col gap-1">
                  <div className="w-8 h-0.5 bg-gold-500 rounded" />
                  <p className="font-sans font-semibold text-white text-sm">{word}</p>
                  <p className="font-sans text-xs text-white/50">
                    {word === 'Confiável' && 'Transparência em cada etapa'}
                    {word === 'Acolhedor' && 'Humano, jamais distante'}
                    {word === 'Sofisticado' && 'Sem jargão ou frieza'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── 01. MARCA ─────────────────────────────────────────────────────── */}
      <section id="marca" className="section-padding bg-warm-50">
        <div className="max-w-content mx-auto">
          <SectionHeader num={1} title="Marca" subtitle="Conceito, posicionamento e tom de voz que guiam toda a comunicação." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Conceito */}
            <div className="bg-white rounded-xl p-8 shadow-card">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Conceito da Marca</p>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4 leading-snug">
                Viva Belle: Seu novo capítulo começa aqui.
              </h2>
              <p className="text-warm-700 leading-relaxed text-sm">
                A <strong>Viva Belle Imobiliária</strong> une a vitalidade e a segurança do lar à beleza do design arquitetônico de alto padrão. Atuamos com curadoria cuidadosa nos bairros mais nobres da capital paulista, combinando rigor técnico, ética comercial e atendimento caloroso.
              </p>
              <div className="mt-6 pt-6 border-t border-warm-100">
                <p className="text-xs font-semibold tracking-widest text-warm-400 uppercase mb-3">Tagline Oficial</p>
                <p className="font-serif text-lg font-semibold text-navy-900 italic">
                  "Seu novo capítulo começa aqui."
                </p>
              </div>
            </div>

            {/* Tom de voz */}
            <div className="bg-white rounded-xl p-8 shadow-card">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Tom de Voz</p>
              <div className="flex flex-col gap-4">
                {[
                  { d: 'Dizemos', ex: '"Encontramos o imóvel certo para você."' },
                  { d: 'Não dizemos', ex: '"Unidade de alto padrão com potencial de valorização."' },
                  { d: 'Dizemos', ex: '"Chame no WhatsApp — respondemos de verdade."' },
                  { d: 'Não dizemos', ex: '"Entre em contato com nosso time de especialistas."' },
                ].map((item, i) => {
                  const isOk = item.d === 'Dizemos'
                  return (
                    <div key={i} className={`flex gap-3 p-4 rounded-lg ${isOk ? 'bg-[#F0FBF5]' : 'bg-warm-100'}`}>
                      <span className="text-xs font-semibold mt-0.5" style={{ color: isOk ? '#2D6A4F' : '#9B9B8E', whiteSpace: 'nowrap' }}>
                        {isOk ? '✓' : '✕'} {item.d}
                      </span>
                      <p className="text-sm text-warm-700 italic">{item.ex}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── 02. LOGOTIPO ──────────────────────────────────────────────────── */}
      <section id="logo" className="section-padding bg-white">
        <div className="max-w-content mx-auto">
          <SectionHeader num={2} title="Logotipo" subtitle="Símbolo arquitetônico com telhado e janela de 4 painéis + onda dourada fluida + wordmark VIVA BELLE." />

          {/* Grid de versões */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Fundo claro - Stacked com Tagline */}
            <div className="flex flex-col gap-4">
              <div className="bg-warm-50 border border-warm-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 min-h-[220px]">
                <LogoWordmark size="md" layout="stacked" withTagline={true} />
              </div>
              <p className="text-xs text-center text-warm-400 font-medium">Versão vertical / oficial — fundo claro</p>
            </div>

            {/* Fundo escuro - Stacked */}
            <div className="flex flex-col gap-4">
              <div className="bg-navy-900 rounded-xl p-8 flex flex-col items-center justify-center gap-4 min-h-[220px]">
                <LogoWordmark size="md" dark layout="stacked" withTagline={true} />
              </div>
              <p className="text-xs text-center text-warm-400 font-medium">Versão invertida — fundo escuro (Hero)</p>
            </div>

            {/* Horizontal - Header */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-warm-200 rounded-xl p-8 flex flex-col items-center justify-center gap-6 min-h-[220px]">
                <LogoWordmark size="md" layout="horizontal" />
                <div className="border-t border-warm-100 pt-4 w-full flex justify-center">
                  <LogoSymbol size={56} />
                </div>
              </div>
              <p className="text-xs text-center text-warm-400 font-medium">Versão horizontal (Header) e Símbolo</p>
            </div>
          </div>

          {/* Área de proteção e regras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-warm-50 rounded-xl p-6 border border-warm-200">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Área de proteção</p>
              <p className="text-sm text-warm-700 leading-relaxed">
                Mantenha um espaço mínimo ao redor do logo equivalente à altura da letra "A" do
                wordmark. Nunca posicione outros elementos dentro dessa área de proteção.
              </p>
            </div>
            <div className="bg-warm-50 rounded-xl p-6 border border-warm-200">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Usos proibidos</p>
              <ul className="flex flex-col gap-1.5">
                {['Não distorcer ou esticar o símbolo','Não alterar as cores aprovadas','Não usar em fundos com baixo contraste','Não recriar o símbolo com outras formas','Não separar símbolo e wordmark em layouts novos'].map(r => (
                  <li key={r} className="flex gap-2 text-sm text-warm-600">
                    <span className="text-warm-300 mt-0.5">✕</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ──── 03. PALETA DE CORES ───────────────────────────────────────────── */}
      <section id="cores" className="section-padding bg-warm-50">
        <div className="max-w-content mx-auto">
          <SectionHeader num={3} title="Paleta de Cores" subtitle="Clique em qualquer swatch para copiar o código HEX. Contraste WCAG AA verificado em todos os pares texto/fundo." />

          {/* Primária */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-warm-400 uppercase mb-5">Cor Primária — Navy</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {PALETTE.primary.map(c => <ColorSwatch key={c.hex} c={c} />)}
            </div>
          </div>

          {/* Destaque */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-warm-400 uppercase mb-5">Cor de Destaque — Âmbar/Dourado</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {PALETTE.accent.map(c => <ColorSwatch key={c.hex} c={c} />)}
            </div>
          </div>

          {/* Neutros */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-warm-400 uppercase mb-5">Neutros Quentes</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {PALETTE.neutral.map(c => <ColorSwatch key={c.hex} c={c} />)}
            </div>
          </div>

          {/* Contraste WCAG */}
          <div className="bg-white rounded-xl p-6 border border-warm-200">
            <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-5">Verificação de Contraste — WCAG AA</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { bg: '#0F2A4A', fg: '#FFFFFF', label: 'Texto branco / Navy 900', ratio: '14.1:1', pass: true },
                { bg: '#C9952A', fg: '#FFFFFF', label: 'Texto branco / Gold 500', ratio: '3.2:1', pass: false, note: 'Usar só em textos grandes' },
                { bg: '#C9952A', fg: '#0F2A4A', label: 'Navy / Gold 500', ratio: '4.6:1', pass: true },
                { bg: '#FFFFFF', fg: '#1A1A14', label: 'Warm 900 / Branco', ratio: '18.5:1', pass: true },
              ].map(c => (
                <div key={c.label} className="rounded-lg overflow-hidden" style={{ background: c.bg }}>
                  <div className="p-4">
                    <p className="text-sm font-semibold" style={{ color: c.fg }}>Aa — Texto de Exemplo</p>
                    <p className="text-xs mt-1" style={{ color: c.fg, opacity: 0.75 }}>{c.label}</p>
                  </div>
                  <div className="px-4 pb-3 flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold" style={{ color: c.fg }}>{c.ratio}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.pass ? 'bg-green-500/20 text-green-300' : 'bg-yellow-400/20 text-yellow-200'}`}>
                      {c.pass ? '✓ AA' : '⚠ Restrito'}
                    </span>
                  </div>
                  {c.note && <p className="text-xs px-4 pb-3 opacity-60" style={{ color: c.fg }}>{c.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── 04. TIPOGRAFIA ────────────────────────────────────────────────── */}
      <section id="tipografia" className="section-padding bg-white">
        <div className="max-w-content mx-auto">
          <SectionHeader num={4} title="Tipografia" subtitle="Playfair Display para títulos (autoridade, elegância), Inter para corpo (legibilidade, modernidade)." />

          {/* Apresentação das fontes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <div className="bg-warm-50 rounded-xl p-8 border border-warm-200">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Títulos — Playfair Display</p>
              <p className="font-serif text-4xl font-bold text-navy-900 leading-tight mb-2">
                Áurea Imóveis
              </p>
              <p className="font-serif text-2xl font-semibold text-navy-900 leading-tight mb-2 italic">
                O seu próximo lar
              </p>
              <p className="font-serif text-lg font-medium text-warm-700 leading-relaxed mb-4">
                Playfair Display Regular · Semibold · Bold · Italic
              </p>
              <p className="text-xs font-mono text-warm-400">
                @import: Google Fonts — Playfair Display<br/>
                Weights: 400, 500, 600, 700, italic
              </p>
            </div>
            <div className="bg-warm-50 rounded-xl p-8 border border-warm-200">
              <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-4">Corpo — Inter</p>
              <p className="font-sans text-2xl font-semibold text-navy-900 mb-2">R$ 1.850.000</p>
              <p className="font-sans text-base font-normal text-warm-700 leading-relaxed mb-2">
                Conectamos famílias do Vale do Paraíba aos melhores imóveis de médio e alto padrão, com atendimento humano.
              </p>
              <p className="font-sans text-sm font-normal text-warm-400 mb-4">
                3 quartos · 2 vagas · 142 m² · Jardim Aquarius, São José dos Campos
              </p>
              <p className="text-xs font-mono text-warm-400">
                @import: Google Fonts — Inter<br/>
                Weights: 300, 400, 500, 600, 700
              </p>
            </div>
          </div>

          {/* Escala tipográfica */}
          <div className="flex flex-col gap-0">
            {TYPE_SCALE.map((t, i) => (
              <div
                key={t.label}
                className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 py-7 border-b border-warm-100 last:border-0"
              >
                {/* Metadados */}
                <div className="flex-none w-44">
                  <p className="text-xs font-semibold text-warm-900">{t.label}</p>
                  <p className="text-xs text-warm-400 mt-0.5">{t.size}px · {t.family === 'serif' ? 'Playfair' : 'Inter'} · {t.w}</p>
                  <p className="text-xs text-warm-300 mt-0.5">{t.use}</p>
                </div>
                {/* Amostra */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-warm-900 truncate md:whitespace-normal"
                    style={{
                      fontFamily: t.family === 'serif' ? '"Playfair Display", Georgia, serif' : '"Inter", system-ui, sans-serif',
                      fontSize: Math.min(t.size, 72),
                      fontWeight: t.w,
                      lineHeight: t.lh,
                      letterSpacing: t.ls || 'normal',
                      textTransform: t.upper ? 'uppercase' : 'none',
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── 05. COMPONENTES ───────────────────────────────────────────────── */}
      <section id="componentes" className="section-padding bg-warm-50">
        <div className="max-w-content mx-auto">
          <SectionHeader num={5} title="Componentes de UI" subtitle="Biblioteca base dos elementos interativos. Todos responsivos, acessíveis e com estados hover/focus/active." />

          {/* Botões */}
          <div className="bg-white rounded-xl p-8 mb-6 shadow-card">
            <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-6">Botões</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="btn btn-primary">Ver imóveis</button>
              <button className="btn btn-secondary">Saiba mais</button>
              <button className="btn btn-ghost">Anunciar imóvel</button>
              <button className="btn btn-ghost-gold">Simular financiamento</button>
              <button className="btn btn-primary" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>Desabilitado</button>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary text-xs px-4 py-2">Pequeno</button>
              <button className="btn btn-primary">Médio (padrão)</button>
              <button className="btn btn-primary px-8 py-3.5 text-base">Grande</button>
              <button className="btn btn-primary w-full max-w-xs">Largura total</button>
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-white rounded-xl p-8 mb-6 shadow-card">
            <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-6">Campos de Formulário</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 tracking-wide uppercase">Nome completo</label>
                <input className="input-field" type="text" placeholder="Ex.: Maria Silva" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 tracking-wide uppercase">Telefone / WhatsApp</label>
                <input className="input-field" type="tel" placeholder="(11) 9 0000-0000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 tracking-wide uppercase">Tipo de imóvel</label>
                <select className="input-field">
                  <option value="">Selecione...</option>
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Cobertura</option>
                  <option>Sala comercial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 tracking-wide uppercase">Faixa de preço</label>
                <select className="input-field">
                  <option value="">Qualquer valor</option>
                  <option>Até R$ 500.000</option>
                  <option>R$ 500k – R$ 1M</option>
                  <option>R$ 1M – R$ 2M</option>
                  <option>Acima de R$ 2M</option>
                </select>
              </div>
              {/* Campo de busca */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-warm-700 mb-1.5 tracking-wide uppercase">Busca por bairro ou endereço</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400"><Icon.Search /></span>
                  <input className="input-field pl-11" type="search" placeholder="Ex.: Jardins, Itaim Bibi, Pinheiros..." />
                </div>
              </div>
            </div>
          </div>

          {/* Badges e Tags */}
          <div className="bg-white rounded-xl p-8 mb-6 shadow-card">
            <p className="text-xs font-semibold tracking-widest text-gold-500 uppercase mb-6">Badges e Tags</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="badge badge-venda">Venda</span>
              <span className="badge badge-aluguel">Aluguel</span>
              <span className="badge badge-lancamento">Lançamento</span>
              <span className="badge badge-exclusivo">Exclusivo</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['🐾 Aceita pets','🏠 Home office','🏫 Perto de escola','🌳 Área verde','🔒 Condomínio fechado','♿ Acessível','🏊 Piscina','🏋️ Academia'].map(t => (
                <TagButton key={t} label={t} />
              ))}
            </div>
          </div>

          {/* Cards de imóvel */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-warm-400 uppercase mb-6">Cards de Imóvel</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_PROPERTIES.map(p => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── 06. VARIÁVEIS CSS ─────────────────────────────────────────────── */}
      <section id="tokens" className="section-padding bg-white">
        <div className="max-w-content mx-auto">
          <SectionHeader num={6} title="Variáveis CSS — Design Tokens" subtitle="Copie e cole no seu :root para usar os tokens em qualquer contexto, mesmo fora do Tailwind." />

          <div className="bg-warm-900 rounded-xl p-8 overflow-auto">
            <pre className="text-sm font-mono text-warm-100 leading-7 whitespace-pre">{CSS_VARS_SNIPPET}</pre>
          </div>
        </div>
      </section>

      {/* ──── 07. ÍCONES ────────────────────────────────────────────────────── */}
      <section id="icones" className="section-padding bg-warm-50">
        <div className="max-w-content mx-auto">
          <SectionHeader num={7} title="Estilo de Ícones" subtitle="Traço fino (stroke 1.75px), terminações arredondadas, 24×24px grid. Biblioteca recomendada: Lucide Icons." />

          <div className="bg-white rounded-xl p-8 shadow-card">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
              {[
                { icon: <Icon.Home />,   label: 'Home' },
                { icon: <Icon.Search />, label: 'Search' },
                { icon: <Icon.MapPin />, label: 'MapPin' },
                { icon: <Icon.Phone />,  label: 'Phone' },
                { icon: <Icon.Bed />,    label: 'Bed' },
                { icon: <Icon.Car />,    label: 'Car' },
                { icon: <Icon.Ruler />,  label: 'Ruler' },
                { icon: <Icon.Heart filled={false} />, label: 'Heart' },
                { icon: <Icon.Star />,   label: 'Star' },
                { icon: <Icon.Copy />,   label: 'Copy' },
                { icon: <Icon.Check />,  label: 'Check' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-warm-50 rounded-lg flex items-center justify-center text-navy-900">
                    {icon}
                  </div>
                  <p className="text-xs text-warm-400 font-mono">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-warm-100">
              <p className="text-sm text-warm-600">
                <strong className="text-warm-900">Biblioteca recomendada:</strong>{' '}
                <code className="bg-warm-100 px-2 py-0.5 rounded text-xs font-mono">lucide-react</code>
                {' '}— npm install lucide-react — mais de 1.400 ícones no mesmo estilo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── RODAPÉ DO STYLE GUIDE ─────────────────────────────────────────── */}
      <footer className="bg-navy-950 text-white px-6 py-12">
        <div className="max-w-content mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoWordmark size="sm" dark />
          <div className="text-center md:text-right">
            <p className="text-xs text-white/40 font-sans">
              Guia de Identidade Visual · Versão 1.0 · Outubro 2026
            </p>
            <p className="text-xs text-white/25 font-sans mt-1">
              Viva Belle Imobiliária LTDA · CRECI-SP 12345-J · CNPJ 12.345.678/0001-90
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

// ─── TAG BUTTON (stateful) ────────────────────────────────────────────────────
function TagButton({ label }) {
  const [active, setActive] = useState(false)
  return (
    <button
      className={`tag ${active ? 'active' : ''}`}
      onClick={() => setActive(!active)}
    >
      {label}
    </button>
  )
}

// ─── SNIPPET CSS VARS ─────────────────────────────────────────────────────────
const CSS_VARS_SNIPPET = `:root {
  /* ── Primária — Navy ─────────────────── */
  --color-navy-950: #091B33;
  --color-navy-900: #0F2A4A;   /* ⭐ Cor primária */
  --color-navy-800: #163568;
  --color-navy-700: #1E4380;
  --color-navy-600: #2D5A96;
  --color-navy-500: #3B6AA6;
  --color-navy-100: #E8EEF5;
  --color-navy-50:  #F0F4F9;

  /* ── Destaque — Âmbar/Dourado ─────────  */
  --color-gold-700: #A07520;
  --color-gold-600: #B5862A;
  --color-gold-500: #C9952A;   /* ⭐ CTAs, detalhes */
  --color-gold-400: #D9A840;
  --color-gold-300: #E8BC60;
  --color-gold-100: #F8EDD0;
  --color-gold-50:  #FDF8EC;

  /* ── Neutros Quentes ──────────────────  */
  --color-white:     #FFFFFF;
  --color-warm-50:   #F8F5F0;  /* ⭐ Fundo alternado */
  --color-warm-100:  #F0EDE8;
  --color-warm-200:  #E0DBD3;
  --color-warm-300:  #C8C2B8;
  --color-warm-400:  #9B9B8E;
  --color-warm-500:  #6B6B5E;
  --color-warm-600:  #4A4A40;
  --color-warm-700:  #3A3A32;
  --color-warm-800:  #2A2A24;
  --color-warm-900:  #1A1A14;  /* ⭐ Texto principal */

  /* ── Semânticas ───────────────────────  */
  --color-success:  #2D6A4F;
  --color-error:    #C0202A;
  --color-warning:  #D4801A;

  /* ── Tipografia ───────────────────────  */
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans:  "Inter", system-ui, sans-serif;

  /* ── Espaçamentos / Raios ─────────────  */
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;

  /* ── Sombras ──────────────────────────  */
  --shadow-card:       0 2px 16px 0 rgba(15,42,74,0.08);
  --shadow-card-hover: 0 8px 32px 0 rgba(15,42,74,0.14);

  /* ── Transição padrão ─────────────────  */
  --transition: 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}`
