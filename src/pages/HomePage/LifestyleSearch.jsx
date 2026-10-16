import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PROPERTIES, LIFESTYLE_TAGS } from '../../data'

export default function LifestyleSearch() {
  const [active, setActive] = useState(new Set())

  function toggle(id) {
    setActive(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = active.size === 0
    ? []
    : PROPERTIES.filter(p => p.tags.some(t => active.has(t)))

  return (
    <section className="bg-warm-50 py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-3">Personalizado para você</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight">Busque pelo seu estilo de vida</h2>
          <p className="text-warm-500 mt-3 max-w-xl mx-auto leading-relaxed">Selecione o que importa para você. Encontramos os imóveis que encaixam no seu dia a dia.</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
          {LIFESTYLE_TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggle(tag.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium cursor-pointer transition-all duration-200 ${
                active.has(tag.id)
                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                  : 'bg-white text-warm-600 border-warm-200 hover:border-navy-700 hover:text-navy-800'
              }`}
            >
              <span role="img">{tag.icon}</span> {tag.label}
            </button>
          ))}
        </div>

        {/* Results feedback */}
        <div className="mt-10 text-center">
          {active.size === 0 ? (
            <p className="text-warm-400 text-sm">Selecione um perfil acima para filtrar os imóveis</p>
          ) : (
            <>
              <p className="text-navy-900 font-semibold">
                {filtered.length} {filtered.length === 1 ? 'imóvel encontra' : 'imóveis encontram'} seu perfil
              </p>
              {filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">
                  {filtered.slice(0, 3).map(p => (
                    <Link key={p.id} to={`/imoveis/${p.id}`} className="relative overflow-hidden rounded-xl group" style={{aspectRatio: '16/9'}}>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm">{p.priceDisplay}</p>
                        <p className="text-white/70 text-xs mt-0.5">{p.neighborhood}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/imoveis" className="btn btn-secondary mt-8 inline-flex px-8 py-3">
                Ver todos os resultados
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
