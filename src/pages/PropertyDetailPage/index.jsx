import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BedDouble,
  Bath,
  Car,
  Maximize2,
  MapPin,
  Phone,
  MessageCircle,
  Heart,
  ArrowLeft,
  Home,
  CheckCircle2,
  ShieldCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Calendar,
} from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import LazyImage from '../../components/LazyImage'
import { getStoredProperties, getStoredPropertyById } from '../../lib/propertiesStorage'
import { useFavorites } from '../../hooks/useFavorites'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { submitPropertyInquiry } from '../../lib/api'
import { supabase } from '../../lib/supabase'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isLocalMode } = useAuth()

  // Buscar imóvel do Supabase ou armazenamento local
  useEffect(() => {
    async function fetchProperty() {
      setLoading(true)
      if (isLocalMode) {
        const localProperty = getStoredPropertyById(id)
        setProperty(localProperty)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) {
          const localProperty = getStoredPropertyById(id)
          setProperty(localProperty)
        } else {
          const gallery = Array.isArray(data.gallery) && data.gallery.length > 0
            ? data.gallery
            : (data.image ? [data.image] : [])
          setProperty({
            id: data.id,
            title: data.title,
            type: data.type,
            priceNum: Number(data.price_num),
            priceDisplay: data.price_display,
            neighborhood: data.neighborhood,
            city: data.city || 'Taubaté',
            address: data.address,
            beds: data.beds || 0,
            suites: data.suites || 0,
            baths: data.baths || 0,
            parking: data.parking || 0,
            area: data.area,
            condo_fee: Number(data.condo_fee || 0),
            iptu: Number(data.iptu || 0),
            image: data.image || gallery[0],
            gallery,
            highlight: data.featured ? 'Destaque' : null,
            tags: data.tags || data.amenities || [],
            description: data.description,
            broker_id: data.broker_id,
            broker_name: data.broker_name,
            broker_creci: data.broker_creci,
          })
        }
      } catch (error) {
        const localProperty = getStoredPropertyById(id)
        setProperty(localProperty)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperty()
  }, [id, isLocalMode])

  const [currentImg, setCurrentImg] = useState(0)
  const [interestForm, setInterestForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: property ? `Olá, gostaria de receber mais informações sobre o imóvel "${property.title}" (Ref: #${property.id}).` : '',
  })
  const [renda, setRenda] = useState(15000)
  const [formSent, setFormSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loading) {
    return (
      <>
        <SEOHelmet title="Carregando..." />
        <Header />
        <main className="bg-warm-50 pt-36 pb-28 min-h-screen flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <SEOHelmet title="Imóvel não encontrado" noIndex />
        <Header />
        <main className="bg-warm-50 pt-36 pb-28 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-6 bg-white p-10 rounded-2xl border border-warm-100 shadow-card">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-4 text-warm-400">
              <Home size={32} />
            </div>
            <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Imóvel não encontrado</h1>
            <p className="text-warm-500 text-sm mb-6">
              O imóvel solicitado não está disponível ou foi retirado do catálogo da Viva Belle Imobiliária.
            </p>
            <Link to="/imoveis" className="btn btn-primary w-full justify-center">
              Ver todos os imóveis
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const parcelaEstimada = (Number(renda) || 0) * 0.30

  const handleInterestSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitPropertyInquiry(property.id, interestForm)

      setFormSent(true)
      toast.success(`Obrigado pelo contato, ${interestForm.nome || 'cliente'}! Nossa equipe entrará em contato em breve.`)

      if (result.fallback) {
        console.log('Inquiry submitted in fallback mode (Supabase not configured)')
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const badgeClass = (type) => {
    if (type === 'VENDA') return 'badge badge-venda'
    if (type === 'ALUGUEL') return 'badge badge-aluguel'
    return 'badge badge-lancamento'
  }

  // Similar properties (exclude current)
  const similarProperties = getStoredProperties()
    .filter(p => String(p.id) !== String(property.id) && (p.status === 'ativo' || !p.status))
    .slice(0, 3)

  // Fotos reais da galeria do imóvel
  const galleryImages = Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : (property.image ? [property.image] : [])

  const safeCurrentIdx = currentImg < galleryImages.length ? currentImg : 0

  const handleShare = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, text: `${property.title} — ${property.priceDisplay}`, url: shareUrl })
        return
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link do imóvel copiado para a área de transferência!')
    } catch {
      toast.success('Copie o link na barra do navegador para compartilhar.')
    }
  }

  const locationText = [
    property.address,
    property.neighborhood,
    property.city || 'Taubaté'
  ].filter(Boolean).join(', ')

  return (
    <>
      <SEOHelmet
        title={`${property.title} — ${property.neighborhood}`}
        description={`${property.title} em ${property.neighborhood}, ${property.city || 'Taubaté'}. ${property.priceDisplay}. ${property.beds} quartos, ${property.area}m². ${property.type === 'VENDA' ? 'Imóvel à venda' : 'Imóvel para alugar'} com a Viva Belle Imobiliária.`}
        path={`/imoveis/${property.id}`}
      />
      <Header />
      <main className="bg-warm-50 pt-28 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb + Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/imoveis"
              className="inline-flex items-center gap-2 text-sm font-medium text-warm-600 hover:text-navy-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para imóveis
            </Link>
            <nav className="text-xs text-warm-400 flex items-center gap-1.5 overflow-hidden">
              <Link to="/" className="hover:text-navy-900 transition-colors">Início</Link>
              <span>/</span>
              <Link to="/imoveis" className="hover:text-navy-900 transition-colors">Imóveis</Link>
              <span>/</span>
              <span className="text-warm-500 font-medium">{property.neighborhood}</span>
              <span>/</span>
              <span className="text-navy-900 font-semibold truncate max-w-[180px]">{property.title}</span>
            </nav>
          </div>

          {/* Galeria Moderna Responsiva (sem espaços vazios) */}
          <div className="relative rounded-2xl overflow-hidden shadow-card bg-warm-200">
            {galleryImages.length <= 1 ? (
              /* Foto única ocupando 100% da largura com proporção elegante */
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] cursor-pointer group overflow-hidden"
              >
                <LazyImage
                  src={galleryImages[0]}
                  alt={property.title}
                  className="w-full h-full"
                  imgClassName="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              /* Mosaico com Foto Principal (60%) + até 4 Fotos Reais da Galeria (40%) */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[320px] sm:h-[420px] md:h-[460px]">
                {/* Foto Principal */}
                <div
                  onClick={() => setLightboxOpen(true)}
                  className={`${
                    galleryImages.length === 2 ? 'md:col-span-6' : 'md:col-span-7'
                  } relative h-full cursor-pointer group overflow-hidden`}
                >
                  <LazyImage
                    src={galleryImages[safeCurrentIdx]}
                    alt={property.title}
                    className="w-full h-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Coluna Direita de Miniaturas Reais */}
                <div
                  className={`hidden md:grid ${
                    galleryImages.length === 2
                      ? 'md:col-span-6 grid-cols-1 grid-rows-1'
                      : galleryImages.length === 3
                        ? 'md:col-span-5 grid-cols-1 grid-rows-2'
                        : 'md:col-span-5 grid-cols-2 grid-rows-2'
                  } gap-2 h-full`}
                >
                  {galleryImages.slice(1, 5).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentImg(idx + 1)
                        setLightboxOpen(true)
                      }}
                      className={`relative overflow-hidden cursor-pointer group h-full ${
                        safeCurrentIdx === idx + 1 ? 'ring-2 ring-inset ring-gold-500' : ''
                      }`}
                    >
                      <LazyImage
                        src={imgUrl}
                        alt={`${property.title} foto ${idx + 2}`}
                        className="w-full h-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-navy-950/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                      {idx === 3 && galleryImages.length > 5 && (
                        <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center text-white font-semibold text-sm">
                          +{galleryImages.length - 5} fotos
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Superiores */}
            <span className={`absolute top-4 left-4 z-20 ${badgeClass(property.type)} shadow-md`}>
              {property.type}
            </span>

            {/* Ações no Topo Direito: Compartilhar + Favoritar */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Compartilhar imóvel"
                title="Compartilhar imóvel"
                className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition text-navy-900"
              >
                <Share2 size={17} />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(property.id)}
                aria-label={isFavorite(property.id) ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                title={isFavorite(property.id) ? 'Remover dos favoritos' : 'Favoritar imóvel'}
                className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <Heart
                  size={18}
                  fill={isFavorite(property.id) ? '#C9952A' : 'none'}
                  stroke={isFavorite(property.id) ? '#C9952A' : '#1A1A14'}
                />
              </button>
            </div>

            {/* Botão Abrir Galeria em Tela Cheia */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 text-xs font-semibold text-navy-900 shadow-lg hover:bg-white transition flex items-center gap-2"
            >
              <Images size={15} className="text-gold-600" />
              Ver {galleryImages.length > 1 ? `todas as ${galleryImages.length} fotos` : 'foto ampliada'}
            </button>
          </div>

          {/* Modal Lightbox de Fotos em Tela Cheia */}
          {lightboxOpen && (
            <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8">
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Fechar galeria"
              >
                <X size={22} />
              </button>

              <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentImg((safeCurrentIdx - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                <img
                  src={galleryImages[safeCurrentIdx]}
                  alt={`${property.title} - foto ${safeCurrentIdx + 1}`}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                />

                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentImg((safeCurrentIdx + 1) % galleryImages.length)}
                    className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              <p className="text-white/80 text-sm mt-4 font-medium">
                {property.title} — Foto {safeCurrentIdx + 1} de {galleryImages.length}
              </p>

              {galleryImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        safeCurrentIdx === i ? 'border-gold-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Layout Principal: 2 Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-10 items-start">
            {/* Coluna Esquerda: Informações detalhadas */}
            <div className="space-y-8">
              {/* Header do Imóvel */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={badgeClass(property.type)}>{property.type}</span>
                  {property.highlight && (
                    <span className="badge bg-gold-100 text-gold-700 font-semibold">{property.highlight}</span>
                  )}
                  {property.isNew && (
                    <span className="badge bg-emerald-100 text-emerald-800 font-semibold">Novo no mercado</span>
                  )}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight leading-tight">
                  {property.title}
                </h1>
                <p className="text-warm-500 mt-2 flex items-center gap-1.5 text-sm">
                  <MapPin size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{locationText}</span>
                </p>
                <div className="mt-4 pt-4 border-t border-warm-200 flex flex-wrap items-baseline gap-4">
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-navy-900">
                    {property.priceDisplay}
                  </p>
                  {property.type === 'ALUGUEL' && (
                    <span className="text-warm-400 text-sm">/mês + encargos</span>
                  )}
                  {(property.condo_fee > 0 || property.iptu > 0) && (
                    <span className="text-xs text-warm-500">
                      {property.condo_fee > 0 && `Condomínio: R$ ${property.condo_fee.toLocaleString('pt-BR')}`}
                      {property.condo_fee > 0 && property.iptu > 0 && ' · '}
                      {property.iptu > 0 && `IPTU: R$ ${property.iptu.toLocaleString('pt-BR')}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Grid 3x2 de características */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">
                  Características principais
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <Maximize2 size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg">{property.area} m²</span>
                    <span className="text-xs text-warm-400">Área útil privativa</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <BedDouble size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg">{property.beds}</span>
                    <span className="text-xs text-warm-400">Dormitórios {property.suites > 0 ? `(${property.suites} suítes)` : ''}</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <Bath size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg">{property.baths || 1}</span>
                    <span className="text-xs text-warm-400">Banheiros sociais</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <Car size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg">{property.parking}</span>
                    <span className="text-xs text-warm-400">Vagas demarcadas</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <Home size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg capitalize">{property.type.toLowerCase()}</span>
                    <span className="text-xs text-warm-400">Tipo de operação</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <MapPin size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg truncate max-w-full px-1">{property.neighborhood}</span>
                    <span className="text-xs text-warm-400">{property.city || 'Taubaté'} - SP</span>
                  </div>
                </div>
              </div>

              {/* Seção Sobre este imóvel */}
              <div className="bg-white rounded-2xl p-8 border border-warm-100 shadow-card">
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-5">Sobre este imóvel</h3>
                <div className="space-y-4 text-warm-700 leading-relaxed text-base whitespace-pre-line">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <>
                      <p>
                        Localizado em um dos endereços mais valorizados de {property.neighborhood}, em {property.city || 'Taubaté'}, este imóvel traduz com perfeição o equilíbrio entre conforto, sofisticação e qualidade de vida no Vale do Paraíba. Sua planta inteligente foi desenhada para valorizar a luminosidade natural e proporcionar ventilação cruzada durante todo o dia.
                      </p>
                      <p>
                        O projeto conta com acabamentos de excelente padrão, ambientes integrados com harmonia entre as áreas sociais e íntimas, além de fácil acesso às principais vias, escolas, comércios e serviços da região.
                      </p>
                    </>
                  )}
                </div>

                {/* Comodidades e Tags */}
                {property.tags && property.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-warm-100">
                    <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-3">
                      Destaques do condomínio
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {property.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-50 border border-warm-200 text-xs font-medium text-navy-900"
                        >
                          <CheckCircle2 size={13} className="text-gold-500" />
                          {tag === 'home-office' && 'Espaço Home Office'}
                          {tag === 'pets' && 'Aceita Animais / Pet Place'}
                          {tag === 'pool' && 'Piscina Climatizada'}
                          {tag === 'gym' && 'Fitness Center Completo'}
                          {tag === 'garden' && 'Jardim e Área Verde'}
                          {!['home-office', 'pets', 'pool', 'gym', 'garden'].includes(tag) && tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Seção Localização */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">Localização</h3>
                <div className="bg-white border border-warm-200 rounded-2xl h-56 flex flex-col items-center justify-center gap-3 text-center p-6 shadow-sm">
                  <MapPin size={48} className="text-gold-400" />
                  <p className="text-base font-semibold text-navy-900">
                    {property.address} — {property.neighborhood}, {property.city}
                  </p>
                  <p className="text-xs text-warm-500 max-w-md leading-relaxed">
                    Localização privilegiada próxima aos melhores centros comerciais, restaurantes, colégios conceituados e vias expressas do Vale do Paraíba.
                  </p>
                </div>
              </div>

              {/* Seção Imóveis Similares */}
              <div className="mt-12 pt-8 border-t border-warm-200">
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-6">
                  Imóveis similares recomendados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {similarProperties.map(sim => (
                    <div key={sim.id} className="bg-white rounded-xl overflow-hidden shadow-card border border-warm-100 flex flex-col">
                      <div className="relative h-36 overflow-hidden">
                        <LazyImage
                          src={sim.image}
                          alt={sim.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <span className={`absolute top-2 left-2 ${badgeClass(sim.type)} text-[10px] px-2 py-0.5`}>
                          {sim.type}
                        </span>
                      </div>
                      <div className="p-3.5 flex flex-col flex-1">
                        <p className="font-bold text-base text-navy-900">{sim.priceDisplay}</p>
                        <p className="font-serif font-semibold text-xs text-warm-900 truncate mt-0.5">{sim.title}</p>
                        <p className="text-[11px] text-warm-400 mt-1 truncate">{sim.neighborhood}</p>
                        <Link
                          to={`/imoveis/${sim.id}`}
                          className="btn btn-ghost w-full justify-center text-xs py-1.5 mt-3 font-medium"
                        >
                          Ver imóvel
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita (Sticky) */}
            <aside className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-card border border-warm-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-warm-400">Valor de negociação</p>
                <p className="font-serif text-3xl font-bold text-navy-900 mt-1">{property.priceDisplay}</p>
                <p className="text-xs text-warm-400 mt-1">IPTU e condomínio sob consulta para este endereço</p>

                {/* Simulador rápido de parcela */}
                <div className="mt-5 p-4 rounded-xl bg-warm-50 border border-warm-200">
                  <label htmlFor="renda-input" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                    Sua renda mensal familiar
                  </label>
                  <div className="relative mb-2">
                    <span className="absolute left-3 top-2.5 text-xs text-warm-400 font-medium">R$</span>
                    <input
                      id="renda-input"
                      type="number"
                      step="500"
                      min="2000"
                      value={renda}
                      onChange={e => setRenda(e.target.value)}
                      className="input-field text-sm py-2 pl-9 pr-3 bg-white"
                      placeholder="Ex: 15.000"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-warm-200">
                    <span className="text-warm-500">Capacidade de parcela (30%):</span>
                    <span className="font-bold text-gold-600 text-sm">
                      {parcelaEstimada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <a
                  href={`https://wa.me/5512997778899?text=${encodeURIComponent(
                    `Olá, tenho interesse no imóvel "${property.title}" (Ref #${property.id}) anunciado no site da Viva Belle Imobiliária em Taubaté.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full justify-center mt-5 py-3.5 text-base font-semibold text-white rounded-xl flex items-center gap-2 hover:opacity-95 transition shadow-sm"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={20} />
                  Falar no WhatsApp
                </a>

                <a
                  href="tel:1236324000"
                  className="btn btn-ghost w-full mt-2.5 justify-center flex items-center gap-2 py-3 text-sm font-semibold"
                >
                  <Phone size={16} />
                  (12) 3632-4000
                </a>

                {/* Card de Conformidade Legal - Corretor Responsável */}
                <div className="mt-4 p-3.5 bg-warm-50 rounded-xl border border-warm-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 block">
                      Corretor Responsável
                    </span>
                    <strong className="text-xs text-navy-900 block truncate">
                      {property.broker_name || 'Patrícia Oliveira'}
                    </strong>
                    <span className="text-[11px] text-gold-600 font-semibold block">
                      {property.broker_creci || 'CRECI 123.456-F'} &middot; Vale do Paraíba
                    </span>
                  </div>
                  {property.broker_id && (
                    <Link
                      to={`/corretor/${property.broker_id}`}
                      className="text-[11px] font-semibold text-navy-900 hover:text-gold-600 underline shrink-0"
                    >
                      Perfil
                    </Link>
                  )}
                </div>

                <div className="border-t border-warm-100 my-6" />

                {/* Formulário de Interesse */}
                <h4 className="font-semibold text-navy-900 text-base mb-1">Tenho interesse</h4>
                <p className="text-xs text-warm-500 mb-4">
                  Envie sua mensagem e receba a ficha técnica completa deste imóvel.
                </p>

                {formSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-900">Mensagem enviada com sucesso!</p>
                    <p className="text-xs text-emerald-700 mt-1">Em breve um corretor entrará em contato.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInterestSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={interestForm.nome}
                        onChange={e => setInterestForm({ ...interestForm, nome: e.target.value })}
                        className="input-field text-xs py-2.5 px-3"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Seu e-mail"
                        value={interestForm.email}
                        onChange={e => setInterestForm({ ...interestForm, email: e.target.value })}
                        className="input-field text-xs py-2.5 px-3"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Seu telefone / WhatsApp"
                        value={interestForm.telefone}
                        onChange={e => setInterestForm({ ...interestForm, telefone: e.target.value })}
                        className="input-field text-xs py-2.5 px-3"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Mensagem..."
                        value={interestForm.mensagem}
                        onChange={e => setInterestForm({ ...interestForm, mensagem: e.target.value })}
                        className="input-field text-xs py-2 px-3 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-secondary w-full justify-center py-3 text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar interesse'}
                    </button>
                  </form>
                )}

                <p className="text-[11px] text-warm-400 text-center mt-4">
                  CRECI-SP 12345-J · Dados protegidos e sigilo garantido
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
