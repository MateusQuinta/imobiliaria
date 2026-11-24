import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, BedDouble, Car, Maximize2, MapPin, Trash2, ArrowRight } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import LazyImage from '../../components/LazyImage'
import { useFavorites } from '../../hooks/useFavorites'
import { getStoredProperties } from '../../lib/propertiesStorage'

export default function FavoritosPage() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites()

  const favoriteProperties = useMemo(() => {
    const all = getStoredProperties()
    return all.filter(p => favorites.has(p.id) || favorites.has(String(p.id)) || favorites.has(Number(p.id)))
  }, [favorites])

  const badgeClass = (type) => {
    if (type === 'VENDA') return 'badge badge-venda'
    if (type === 'ALUGUEL') return 'badge badge-aluguel'
    return 'badge badge-lancamento'
  }

  return (
    <>
      <SEOHelmet
        title="Meus Imóveis Favoritos"
        description="Compare e acompanhe os imóveis que você salvou na Viva Belle Imobiliária em Taubaté e Vale do Paraíba."
        path="/favoritos"
      />
      <Header />

      <div className="bg-navy-900 pt-28 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-300 mb-2">
              Seleção Personalizada
            </p>
            <h1 className="font-serif text-4xl font-bold text-white tracking-tight">
              Meus Favoritos
            </h1>
            <p className="text-white/60 mt-1 text-sm">
              {favoriteProperties.length === 0
                ? 'Você ainda não salvou nenhum imóvel.'
                : `${favoriteProperties.length} imóvel(is) salvos para comparar e agendar visita.`}
            </p>
          </div>

          {favoriteProperties.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs py-2.5 px-4 gap-2 self-start sm:self-auto"
            >
              <Trash2 size={14} /> Limpar lista
            </button>
          )}
        </div>
      </div>

      <main className="bg-warm-50 min-h-[60vh] py-14 px-6">
        <div className="max-w-[1200px] mx-auto">
          {favoriteProperties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 shadow-card max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-gold-50 text-gold-500 flex items-center justify-center mx-auto mb-5">
                <Heart size={30} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                Nenhum favorito ainda
              </h2>
              <p className="text-warm-500 text-sm mb-6 leading-relaxed">
                Explore nosso catálogo de imóveis em Taubaté e no Vale do Paraíba e clique no coração para salvar os seus preferidos aqui.
              </p>
              <Link to="/imoveis" className="btn btn-primary inline-flex gap-2">
                Explorar Imóveis <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map(p => (
                <div key={p.id} className="card group flex flex-col">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <LazyImage
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className={`absolute top-4 left-4 ${badgeClass(p.type)} z-10`}>
                      {p.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(p.id)}
                      className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      aria-label="Remover dos favoritos"
                    >
                      <Heart size={16} fill="#C9952A" stroke="#C9952A" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-sans font-bold text-2xl text-navy-900">{p.priceDisplay}</p>
                      <p className="font-serif font-semibold text-warm-900 text-lg mt-1 leading-snug line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-xs text-warm-400 mt-1.5 flex items-center gap-1">
                        <MapPin size={12} className="flex-none text-gold-500" />
                        {p.neighborhood}, {p.city || 'Taubaté'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-4 pt-4 mt-4 border-t border-warm-100 text-xs text-warm-500">
                        {p.beds > 0 && <span className="flex items-center gap-1.5"><BedDouble size={13} /> {p.beds} qts</span>}
                        {p.parking > 0 && <span className="flex items-center gap-1.5"><Car size={13} /> {p.parking} vg</span>}
                        {p.area > 0 && <span className="flex items-center gap-1.5"><Maximize2 size={13} /> {p.area} m²</span>}
                      </div>

                      <Link
                        to={`/imoveis/${p.id}`}
                        className="btn btn-primary w-full justify-center text-xs mt-4 py-2.5"
                      >
                        Ver detalhes do imóvel
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
