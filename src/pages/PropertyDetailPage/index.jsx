import { useState } from 'react'
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
} from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import LazyImage from '../../components/LazyImage'
import { PROPERTIES } from '../../data'
import { useFavorites } from '../../hooks/useFavorites'
import toast from 'react-hot-toast'
import { submitPropertyInquiry } from '../../lib/api'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const property = PROPERTIES.find(p => String(p.id) === String(id))
  const { toggleFavorite, isFavorite } = useFavorites()

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
  const similarProperties = PROPERTIES.filter(p => p.id !== property.id).slice(0, 3)

  // Gallery variation filters
  const galleryFilters = [
    { filter: 'none', label: 'Fachada Principal' },
    { filter: 'brightness(0.9) contrast(1.05)', label: 'Living Room' },
    { filter: 'brightness(1.08) saturate(1.15)', label: 'Suíte Master' },
    { filter: 'saturate(1.25) contrast(1.02)', label: 'Varanda Gourmet' },
    { filter: 'brightness(0.95) saturate(1.05)', label: 'Lazer e Vista' },
  ]

  return (
    <>
      <SEOHelmet
        title={`${property.title} — ${property.neighborhood}`}
        description={`${property.title} no ${property.neighborhood}. ${property.priceDisplay}. ${property.beds} quartos, ${property.area}m². ${property.type === 'VENDA' ? 'Imóvel à venda' : 'Imóvel para alugar'} com a Viva Belle Imobiliária.`}
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

          {/* Galeria */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-2 rounded-2xl overflow-hidden relative shadow-card bg-navy-950">
            {/* Imagem principal */}
            <div className="relative h-72 sm:h-96 md:h-[430px] overflow-hidden group">
              <LazyImage
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 cursor-pointer"
                style={{ filter: galleryFilters[currentImg]?.filter || 'none' }}
              />
              <span className={`absolute top-4 left-4 ${badgeClass(property.type)} shadow-md`}>
                {property.type}
              </span>
              <button
                type="button"
                onClick={() => toggleFavorite(property.id)}
                aria-label={isFavorite(property.id) ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <Heart
                  size={18}
                  fill={isFavorite(property.id) ? '#C9952A' : 'none'}
                  stroke={isFavorite(property.id) ? '#C9952A' : '#1A1A14'}
                />
              </button>
            </div>

            {/* Grid 2x2 lateral */}
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-[430px]">
              {galleryFilters.slice(1, 5).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImg(idx + 1)}
                  className={`relative overflow-hidden cursor-pointer group h-full border-2 transition ${
                    currentImg === idx + 1 ? 'border-gold-500' : 'border-transparent'
                  }`}
                >
                  <LazyImage
                    src={property.image}
                    alt={`${property.title} foto ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ filter: item.filter }}
                  />
                  <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            {/* Botão Ver todas as fotos */}
            <button
              type="button"
              onClick={() => setCurrentImg((currentImg + 1) % galleryFilters.length)}
              className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-lg px-4 py-2 text-xs font-semibold text-navy-900 shadow-lg hover:bg-white transition flex items-center gap-1.5"
            >
              Ver fotos ({currentImg + 1}/{galleryFilters.length})
            </button>
          </div>

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
                  <span>{property.address}, {property.neighborhood} — {property.city}</span>
                </p>
                <div className="mt-4 pt-4 border-t border-warm-200 flex items-baseline gap-2">
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-navy-900">
                    {property.priceDisplay}
                  </p>
                  {property.type === 'ALUGUEL' && (
                    <span className="text-warm-400 text-sm">/mês + encargos</span>
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
                    <span className="text-xs text-warm-400">Dormitórios (suítes)</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 text-center border border-warm-100 shadow-sm">
                    <Bath size={24} className="text-gold-500 mb-1" />
                    <span className="font-semibold text-navy-900 text-lg">{property.baths || 3}</span>
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
                    <span className="text-xs text-warm-400">Bairro nobre SP</span>
                  </div>
                </div>
              </div>

              {/* Seção Sobre este imóvel */}
              <div className="bg-white rounded-2xl p-8 border border-warm-100 shadow-card">
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-5">Sobre este imóvel</h3>
                <div className="space-y-4 text-warm-700 leading-relaxed text-base">
                  <p>
                    Localizado em um dos endereços mais cobiçados de {property.neighborhood}, este imóvel traduz com perfeição o conceito de viver bem na capital paulista. Sua planta inteligente foi desenhada para valorizar a luminosidade natural e proporcionar ventilação cruzada durante todo o dia, integrando com harmonia as áreas sociais e íntimas.
                  </p>
                  <p>
                    O projeto de interiores conta com acabamentos de altíssimo padrão, incluindo pisos em mármore importado nas áreas sociais, marcenaria sob medida de linhagem nobre, esquadrias com isolamento acústico de ponta e infraestrutura completa para climatização e automação residencial. A varanda ampla oferece uma vista aberta e definitiva sobre a copa das árvores e o skyline da cidade.
                  </p>
                  <p>
                    O condomínio de torre única dispõe de segurança patrimonial 24 horas com controle biométrico e monitoramento perimetral de última geração. O lazer é completo e refinado, oferecendo piscina aquecida com raia, academia com equipamentos de padrão internacional, espaço gourmet integrado a lounge externo e vagas cobertas com ponto para carregamento de veículos elétricos.
                  </p>
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
                    Localização privilegiada próxima aos melhores restaurantes, empórios gastronômicos, colégios internacionais e vias expressas de São Paulo.
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
                  href={`https://wa.me/5511999990000?text=${encodeURIComponent(
                    `Olá, tenho interesse no imóvel "${property.title}" (Ref #${property.id}) anunciado no site da Viva Belle Imobiliária.`
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
                  href="tel:1130000000"
                  className="btn btn-ghost w-full mt-2.5 justify-center flex items-center gap-2 py-3 text-sm font-semibold"
                >
                  <Phone size={16} />
                  (11) 3000-0000
                </a>

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
