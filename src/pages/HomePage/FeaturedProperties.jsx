import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Car, Maximize2, MapPin, Heart, ArrowRight } from 'lucide-react'
import { PROPERTIES } from '../../data'

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState('todos')
  const [favorites, setFavorites] = useState(new Set())

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'VENDA', label: 'Venda' },
    { id: 'ALUGUEL', label: 'Aluguel' },
    { id: 'LANÇAMENTO', label: 'Lançamentos' },
  ]

  const filtered = activeTab === 'todos'
    ? PROPERTIES
    : PROPERTIES.filter(p => p.type === activeTab)

  function toggleFav(id) {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const badgeClass = (type) => {
    if (type === 'VENDA') return 'badge badge-venda'
    if (type === 'ALUGUEL') return 'badge badge-aluguel'
    return 'badge badge-lancamento'
  }

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-3">Curadoria Viva Belle</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight">Imóveis em destaque</h2>
            <p className="text-warm-500 mt-3 max-w-md leading-relaxed">Selecionados pela nossa equipe com base em localização, qualidade construtiva e custo-benefício.</p>
          </div>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white border-navy-900'
                    : 'bg-white text-warm-600 border-warm-200 hover:border-navy-600 hover:text-navy-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="property-card group">
              {/* Photo */}
              <div className="relative overflow-hidden" style={{aspectRatio: '4/3'}}>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-navy-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Badge type */}
                <span className={`absolute top-4 left-4 ${badgeClass(p.type)}`}>{p.type}</span>
                {/* Favorite */}
                <button
                  onClick={() => toggleFav(p.id)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  aria-label="Favoritar"
                >
                  <Heart size={16} fill={favorites.has(p.id) ? '#C9952A' : 'none'} stroke={favorites.has(p.id) ? '#C9952A' : 'currentColor'} className="text-warm-500" />
                </button>
                {/* New badge */}
                {p.isNew && (
                  <span className="absolute bottom-4 left-4 text-xs font-semibold bg-gold-500 text-white px-3 py-1 rounded-md">Novo</span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-0">
                <p className="font-sans font-bold text-2xl text-navy-900">{p.priceDisplay}</p>
                <p className="font-serif font-semibold text-warm-900 text-lg mt-1 leading-snug">{p.title}</p>
                <p className="text-xs text-warm-400 mt-1.5 flex items-center gap-1">
                  <MapPin size={11} className="flex-none" />{p.address}
                </p>
                <div className="border-t border-warm-100 mt-4 pt-4 flex items-center gap-4 text-warm-500 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><BedDouble size={14} />{p.beds} qtos</span>
                  <span className="flex items-center gap-1.5"><Car size={14} />{p.parking} vagas</span>
                  <span className="flex items-center gap-1.5"><Maximize2 size={14} />{p.area} m²</span>
                </div>
                <Link
                  to={`/imoveis/${p.id}`}
                  className="btn btn-ghost w-full justify-center mt-4 text-sm py-2.5"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <Link to="/imoveis" className="btn btn-secondary px-10 py-4 text-base flex items-center gap-2">
            Ver todos os imóveis <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
