import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BedDouble, Car, Maximize2, MapPin, Heart, SlidersHorizontal, X } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import LazyImage from '../../components/LazyImage'
import { PROPERTIES, NEIGHBORHOODS } from '../../data'
import { useFavorites } from '../../hooks/useFavorites'
import { supabase } from '../../lib/supabase'

export default function ListingPage() {
  const [searchParams] = useSearchParams()
  const paramTipo = searchParams.get('tipo') || 'todos'
  const paramCategoria = searchParams.get('categoria')
  const { toggleFavorite, isFavorite, favoriteCount } = useFavorites()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    tipo: paramTipo,
    categoria: paramCategoria ? [paramCategoria.charAt(0).toUpperCase() + paramCategoria.slice(1)] : [],
    quartos: '0',
    vagas: '0',
    precoMin: '',
    precoMax: '',
    bairros: [],
  })

  useEffect(() => {
    const urlTipo = searchParams.get('tipo') || 'todos'
    const urlCat = searchParams.get('categoria')
    setFilters(f => ({
      ...f,
      tipo: urlTipo,
      categoria: urlCat ? [urlCat.charAt(0).toUpperCase() + urlCat.slice(1)] : f.categoria,
    }))
  }, [searchParams])

  // Buscar imóveis do Supabase
  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'ativo')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Erro ao buscar imóveis:', error)
          // Fallback para dados locais se Supabase falhar
          setProperties(PROPERTIES)
        } else {
          // Mapear dados do Supabase para o formato esperado
          const mapped = data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            priceNum: Number(p.price_num),
            priceDisplay: p.price_display,
            neighborhood: p.neighborhood,
            address: p.address,
            beds: p.beds || 0,
            baths: p.baths || 0,
            parking: p.parking || 0,
            area: p.area,
            image: p.image,
            highlight: p.featured ? 'Destaque' : null,
            tags: p.tags || []
          }))
          setProperties(mapped)
        }
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error)
        setProperties(PROPERTIES)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperties()
  }, [])

  const [sort, setSort] = useState('relevancia')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const setF = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  function toggleArr(key, val) {
    setFilters(f => {
      const arr = f[key]
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const toggleFav = (id) => toggleFavorite(id)

  const TIPOS = ['Todos', 'Venda', 'Aluguel', 'Lançamento']
  const CATEGORIAS = ['Apartamento', 'Casa', 'Cobertura', 'Studio', 'Sala Comercial']
  const QUARTOS_OPTS = ['Qualquer', '1+', '2+', '3+', '4+']
  const VAGAS_OPTS = ['Qualquer', '1+', '2+', '3+']

  const filtered = useMemo(() => {
    let list = [...properties]
    if (filters.tipo && filters.tipo.toLowerCase() !== 'todos') {
      const map = {
        'venda': 'VENDA',
        'aluguel': 'ALUGUEL',
        'lancamento': 'LANÇAMENTO',
        'lançamento': 'LANÇAMENTO',
        'Venda': 'VENDA',
        'Aluguel': 'ALUGUEL',
        'Lançamento': 'LANÇAMENTO',
      }
      const t = map[filters.tipo] || filters.tipo.toUpperCase()
      list = list.filter(p => p.type === t)
    }
    if (filters.categoria.length > 0) {
      list = list.filter(p => filters.categoria.some(c => p.title.toLowerCase().includes(c.toLowerCase())))
    }
    if (filters.quartos && filters.quartos !== '0' && filters.quartos !== 'Qualquer') {
      const min = parseInt(filters.quartos, 10)
      list = list.filter(p => p.beds >= min)
    }
    if (filters.vagas && filters.vagas !== '0' && filters.vagas !== 'Qualquer') {
      const min = parseInt(filters.vagas, 10)
      list = list.filter(p => p.parking >= min)
    }
    if (filters.bairros.length > 0) {
      list = list.filter(p => filters.bairros.includes(p.neighborhood))
    }
    if (filters.precoMin) {
      const min = Number(filters.precoMin.replace(/\D/g, ''))
      if (!isNaN(min) && min > 0) {
        list = list.filter(p => p.priceNum >= min)
      }
    }
    if (filters.precoMax) {
      const max = Number(filters.precoMax.replace(/\D/g, ''))
      if (!isNaN(max) && max > 0) {
        list = list.filter(p => p.priceNum <= max)
      }
    }
    if (sort === 'menor') list.sort((a, b) => a.priceNum - b.priceNum)
    if (sort === 'maior') list.sort((a, b) => b.priceNum - a.priceNum)
    return list
  }, [filters, sort, properties])

  const badgeClass = (type) => {
    if (type === 'VENDA') return 'badge badge-venda'
    if (type === 'ALUGUEL') return 'badge badge-aluguel'
    return 'badge badge-lancamento'
  }

  const renderFilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Tipo de negócio</p>
        <div className="flex flex-col gap-2">
          {TIPOS.map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="tipo"
                checked={filters.tipo === t.toLowerCase() || filters.tipo === t}
                onChange={() => setF('tipo', t.toLowerCase())}
                className="accent-gold-500"
              />
              <span className="text-sm text-warm-700 group-hover:text-navy-900">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Tipo de imóvel</p>
        <div className="flex flex-col gap-2">
          {CATEGORIAS.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categoria.includes(c)}
                onChange={() => toggleArr('categoria', c)}
                className="accent-gold-500 rounded"
              />
              <span className="text-sm text-warm-700 group-hover:text-navy-900">{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Faixa de preço</p>
        <div className="flex gap-2">
          <input
            className="input-field text-xs px-3 py-2"
            placeholder="Mín R$"
            value={filters.precoMin}
            onChange={e => setF('precoMin', e.target.value)}
          />
          <input
            className="input-field text-xs px-3 py-2"
            placeholder="Máx R$"
            value={filters.precoMax}
            onChange={e => setF('precoMax', e.target.value)}
          />
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Quartos</p>
        <div className="flex flex-wrap gap-2">
          {QUARTOS_OPTS.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => setF('quartos', String(i))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                filters.quartos === String(i)
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'border-warm-200 text-warm-600 hover:border-navy-700'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Vagas</p>
        <div className="flex flex-wrap gap-2">
          {VAGAS_OPTS.map((v, i) => (
            <button
              key={v}
              type="button"
              onClick={() => setF('vagas', String(i))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                filters.vagas === String(i)
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'border-warm-200 text-warm-600 hover:border-navy-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">Bairros</p>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {NEIGHBORHOODS.map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.bairros.includes(b)}
                onChange={() => toggleArr('bairros', b)}
                className="accent-gold-500 rounded"
              />
              <span className="text-sm text-warm-700 group-hover:text-navy-900">{b}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="border-t border-warm-100" />
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(false)}
        className="btn btn-primary w-full justify-center"
      >
        Aplicar filtros
      </button>
      <button
        type="button"
        onClick={() => setFilters({ tipo: 'todos', categoria: [], quartos: '0', vagas: '0', precoMin: '', precoMax: '', bairros: [] })}
        className="text-sm text-warm-400 text-center hover:text-navy-900 transition"
      >
        Limpar tudo
      </button>
    </div>
  )

  return (
    <>
      <SEOHelmet title="Imóveis em São Paulo" description="Busque imóveis de médio e alto padrão em São Paulo. Apartamentos, casas, coberturas e lançamentos nos melhores bairros." path="/imoveis" />
      <Header />
      {/* Page hero */}
      <div className="bg-navy-900 pt-28 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs text-white/50 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span className="mx-2 text-white/30">/</span>
            Imóveis
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight">Imóveis em São Paulo</h1>
          <p className="text-white/60 mt-2 text-base">Encontre o imóvel ideal com a curadoria exclusiva da Viva Belle</p>
        </div>
      </div>

      <main className="bg-warm-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden btn btn-ghost mb-6 flex items-center gap-2 bg-white"
          >
            <SlidersHorizontal size={16} /> Filtros {filtered.length > 0 && `(${filtered.length})`}
          </button>

          <div className="flex gap-8 items-start">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block w-72 flex-none">
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24 border border-warm-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-navy-900 text-lg">Filtrar imóveis</h3>
                </div>
                {renderFilterPanel()}
              </div>
            </aside>

            {/* Mobile filter overlay */}
            {mobileFiltersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6 pb-3 border-b border-warm-100">
                    <h3 className="font-semibold text-navy-900 text-lg">Filtrar imóveis</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-1 rounded-lg text-warm-500 hover:text-navy-900 hover:bg-warm-100 transition"
                      aria-label="Fechar filtros"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {renderFilterPanel()}
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-warm-100 shadow-sm">
                <p className="text-sm text-warm-600">
                  {loading ? 'Carregando...' : <span className="font-semibold text-navy-900">{filtered.length}</span>} {loading ? '' : 'imóveis encontrados'}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs text-warm-400 font-medium whitespace-nowrap">Ordenar por:</label>
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="input-field w-auto text-sm py-2 px-3 bg-warm-50"
                  >
                    <option value="relevancia">Relevância</option>
                    <option value="menor">Menor preço</option>
                    <option value="maior">Maior preço</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-warm-100 shadow-sm px-6">
                  <p className="font-serif text-2xl text-navy-900 font-semibold">Nenhum imóvel encontrado</p>
                  <p className="text-warm-500 mt-2 text-sm max-w-md mx-auto">
                    Não encontramos propriedades correspondentes a todos os filtros selecionados. Experimente limpar alguns critérios.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilters({ tipo: 'todos', categoria: [], quartos: '0', vagas: '0', precoMin: '', precoMax: '', bairros: [] })}
                    className="btn btn-secondary mt-6"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(p => (
                    <div key={p.id} className="property-card group bg-white border border-warm-100/80">
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <LazyImage
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={`absolute top-3 left-3 ${badgeClass(p.type)} shadow-sm`}>
                          {p.type}
                        </span>
                        {p.highlight && (
                          <span className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded">
                            {p.highlight}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFav(p.id)}
                          aria-label={isFavorite(p.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition"
                        >
                          <Heart
                            size={16}
                            fill={isFavorite(p.id) ? '#C9952A' : 'none'}
                            stroke={isFavorite(p.id) ? '#C9952A' : '#9B9B8E'}
                          />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <p className="font-bold text-2xl text-navy-900">{p.priceDisplay}</p>
                        <p className="font-serif font-semibold text-warm-900 mt-1 line-clamp-1 text-base">{p.title}</p>
                        <p className="text-xs text-warm-400 mt-1.5 flex items-center gap-1.5">
                          <MapPin size={13} className="text-gold-500 flex-shrink-0" />
                          <span className="truncate">{p.address} — {p.neighborhood}</span>
                        </p>
                        <div className="flex items-center justify-between text-warm-500 text-xs font-medium mt-4 pt-3 border-t border-warm-100">
                          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-warm-400" />{p.beds || 0} qtos</span>
                          <span className="flex items-center gap-1.5"><Car size={14} className="text-warm-400" />{p.parking || 0} vagas</span>
                          <span className="flex items-center gap-1.5"><Maximize2 size={14} className="text-warm-400" />{p.area}m²</span>
                        </div>
                        <Link
                          to={`/imoveis/${p.id}`}
                          className="btn btn-ghost w-full justify-center mt-4 text-sm py-2.5 font-medium hover:border-gold-500 hover:text-gold-600 transition"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
