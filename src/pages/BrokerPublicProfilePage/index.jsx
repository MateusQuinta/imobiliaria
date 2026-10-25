import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import { PROPERTIES } from '../../data'
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Building2, 
  Award, 
  ChevronRight,
  BedDouble,
  Bath,
  Car,
  Maximize2
} from 'lucide-react'

export default function BrokerPublicProfilePage() {
  const { id } = useParams()
  const [broker, setBroker] = useState(null)
  const [brokerProperties, setBrokerProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBrokerData() {
      setLoading(true)
      try {
        // 1. Buscar dados do corretor em admin_users
        const { data: brokerData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (brokerData) {
          setBroker(brokerData)
        } else {
          // Fallback para id fictício/demo
          setBroker({
            id: id,
            name: 'Patrícia Oliveira',
            creci: '123.456-F',
            creci_uf: 'SP',
            city: 'São José dos Campos',
            phone: '(12) 99999-0000',
            email: 'patricia@vivabelle.com.br',
            avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
            bio: 'Especialista em imóveis de médio e alto padrão no Vale do Paraíba com mais de 8 anos de experiência. Foco dedicado nos bairros Jardim Aquarius, Urbanova e Jardim das Colinas em São José dos Campos. Atendimento pautado em discrição e precisão jurídica.'
          })
        }

        // 2. Buscar imóveis associados
        const { data: propsData } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'ativo')

        if (propsData && propsData.length > 0) {
          setBrokerProperties(propsData)
        } else {
          setBrokerProperties(PROPERTIES.slice(0, 4))
        }
      } catch (err) {
        console.error(err)
        setBrokerProperties(PROPERTIES.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    loadBrokerData()
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-warm-50 text-navy-900">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  const cleanPhone = (broker?.phone || '12999990000').replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá, ${broker?.name}! Vi seu perfil na Viva Belle Imobiliária e gostaria de conversar sobre imóveis no Vale do Paraíba.`)}`

  return (
    <>
      <SEOHelmet
        title={`${broker?.name || 'Corretor'} — Consultor Imobiliário`}
        description={`Conheça ${broker?.name}, consultor imobiliário credenciado pela Viva Belle Imobiliária (CRECI-${broker?.creci_uf || 'SP'} ${broker?.creci}). Imóveis de alto padrão no Vale do Paraíba.`}
        path={`/corretor/${id}`}
      />
      <Header />

      {/* Hero do Perfil */}
      <section className="bg-navy-950 pt-32 pb-16 px-6 text-white border-b border-navy-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 text-center md:text-left">
            <img
              src={broker?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'}
              alt={broker?.name}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-gold-500/40 shadow-2xl shrink-0"
            />

            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider border border-gold-500/30">
                <ShieldCheck size={14} className="text-gold-400" />
                Corretor Credenciado Viva Belle
              </div>

              <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {broker?.name}
                </h1>
                <p className="text-gold-400 font-medium text-sm sm:text-base mt-1">
                  CRECI-{broker?.creci_uf || 'SP'} {broker?.creci} &middot; {broker?.city || 'Vale do Paraíba'}
                </p>
              </div>

              <p className="text-white/70 text-sm leading-relaxed font-light">
                {broker?.bio || 'Consultor imobiliário especializado na curadoria de imóveis de médio e alto padrão no Vale do Paraíba. Atendimento consultivo, ético e focado nas necessidades da sua família.'}
              </p>

              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary gap-2 text-xs py-3 px-6 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <MessageCircle size={16} /> Falar no WhatsApp
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="btn btn-secondary gap-2 text-xs py-3 px-6 bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Phone size={16} /> Ligar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfólio de Imóveis do Corretor */}
      <section className="py-20 px-6 bg-warm-50 min-h-[500px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-4 border-b border-warm-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">
                Portfólio Exclusivo
              </span>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mt-1">
                Imóveis com este Corretor
              </h2>
            </div>
            <span className="text-sm text-warm-500 font-medium">
              {brokerProperties.length} oportunidade(s) disponível(is)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokerProperties.map(prop => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card border border-warm-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {prop.type}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-navy-900 font-bold text-base px-3 py-1 rounded-xl shadow-md">
                      {prop.priceDisplay || `R$ ${Number(prop.price_num || 0).toLocaleString('pt-BR')}`}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider">
                      {prop.neighborhood}, {prop.city || 'São José dos Campos'}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-navy-900 mt-1 mb-4 line-clamp-1 group-hover:text-gold-600 transition">
                      {prop.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-warm-500 pt-3 border-t border-warm-100">
                      {prop.beds && <span className="flex items-center gap-1"><BedDouble size={14} /> {prop.beds} qts</span>}
                      {prop.baths && <span className="flex items-center gap-1"><Bath size={14} /> {prop.baths} banh</span>}
                      {prop.parking && <span className="flex items-center gap-1"><Car size={14} /> {prop.parking} vagas</span>}
                      {prop.area && <span className="flex items-center gap-1"><Maximize2 size={14} /> {prop.area} m²</span>}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/imoveis/${prop.id}`}
                    className="btn btn-secondary w-full justify-center text-xs py-2.5 font-semibold text-navy-900 hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-colors"
                  >
                    Ver Detalhes do Imóvel
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
