const STATS = [
  { value: 0, suffix: '', label: 'Anos de mercado' },
  { value: 0, suffix: '', label: 'Imóveis negociados' },
  { value: 0, suffix: '', label: 'Clientes atendidos' },
  { value: '-', suffix: '', label: 'Satisfação' },
]

export default function StatsSection() {
  return (
    <section className="bg-navy-900 py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-10 px-6 text-center gap-2">
              <span className="font-serif text-6xl md:text-7xl font-bold text-white tabular-nums">
                {s.value === 0 ? '0' : s.value}{s.suffix}
              </span>
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-300 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-white/30 text-xs mt-8">Em breve · Dados a serem atualizados</p>
      </div>
    </section>
  )
}
