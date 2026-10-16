import { Link } from 'react-router-dom'
import {
  Shield,
  Heart,
  Star,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
} from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { TEAM } from '../../data'

export default function SobrePage() {
  const valores = [
    {
      icon: Shield,
      title: 'Transparência',
      desc: 'Processos claros e informações completas do primeiro contato à assinatura. Nossos clientes têm acesso direto a laudos de vistoria, certidões e histórico documental integral.',
    },
    {
      icon: Heart,
      title: 'Atendimento Humano',
      desc: 'Ouvimos suas necessidades reais e acompanhamos você com dedicação e empatia. Entendemos que a compra de um imóvel envolve sonhos de vida, por isso operamos sem pressa e sem pressão.',
    },
    {
      icon: Star,
      title: 'Curadoria Rigorosa',
      desc: 'Selecionamos apenas imóveis com alto potencial e padrão construtivo comprovado nos melhores bairros de São Paulo. Menos de 15% dos imóveis avaliados entram em nosso portfólio.',
    },
  ]

  const stats = [
    { num: '15+', label: 'Anos de Mercado' },
    { num: '2.800+', label: 'Imóveis Negociados' },
    { num: '4.200+', label: 'Clientes Atendidos' },
    { num: '98%', label: 'Satisfação dos Clientes' },
  ]

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-navy-900 pt-32 pb-20 px-6 text-white">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-300 mb-3">
            História & Propósito
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Quem somos
          </h1>
          <p className="text-white/70 max-w-2xl mt-4 text-lg leading-relaxed font-light">
            A Viva Belle Imobiliária nasceu para transformar a experiência imobiliária de alto padrão em São Paulo, aliando consultoria técnica rigorosa a um atendimento caloroso, próximo e descomplicado.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-2">
              Desde 2011 em São Paulo
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mb-6 leading-snug">
              Nossa história: construindo laços que atravessam gerações
            </h2>
            <div className="space-y-4 text-warm-600 leading-relaxed text-base">
              <p>
                Fundada em 2011 no coração dos Jardins, a Viva Belle Imobiliária começou com uma missão clara: criar uma imobiliária boutique onde a curadoria de imóveis excepcionais caminhasse lado a lado com a mais absoluta ética comercial e atenção meticulosa aos detalhes.
              </p>
              <p>
                Ao longo dos anos, expandimos nossa atuação com consistência pelos bairros mais nobres da capital paulista — incluindo Itaim Bibi, Pinheiros, Moema, Vila Madalena e Brooklin. Cada nova praça foi aberta com corretores especializados que realmente vivem e respiram a dinâmica desses bairros.
              </p>
              <p>
                Hoje, somos reconhecidos por investidores, famílias e incorporadoras de prestígio como uma referência de liquidez, discrição e segurança jurídica. Nosso compromisso segue o mesmo do primeiro dia: colocar as aspirações de quem nos procura no centro de todas as decisões.
              </p>
            </div>
          </div>

          <div className="bg-warm-100 rounded-2xl h-80 sm:h-96 flex items-center justify-center p-8 border border-warm-200 shadow-card relative overflow-hidden">
            {/* SVG decorativo elegante de linhas de planta baixa e arquitetura */}
            <svg
              className="w-full h-full text-warm-300"
              viewBox="0 0 500 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid de fundo sutil */}
              <defs>
                <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E0DBD3" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.6" />

              {/* Linhas de planta baixa arquitetônica */}
              <rect x="50" y="40" width="400" height="260" rx="4" stroke="#0F2A4A" strokeWidth="2.5" />
              <line x1="50" y1="160" x2="310" y2="160" stroke="#0F2A4A" strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="310" y1="40" x2="310" y2="300" stroke="#0F2A4A" strokeWidth="2" />
              <line x1="180" y1="160" x2="180" y2="300" stroke="#0F2A4A" strokeWidth="1.5" />

              {/* Portas e arcos em dourado */}
              <path d="M 310 100 A 40 40 0 0 1 350 140" fill="none" stroke="#C9952A" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M 180 220 A 35 35 0 0 1 215 255" fill="none" stroke="#C9952A" strokeWidth="2" strokeDasharray="4 3" />

              {/* Fachada estilizada central */}
              <rect x="340" y="80" width="80" height="180" rx="3" stroke="#C9952A" strokeWidth="2" fill="#F8F5F0" />
              <line x1="360" y1="110" x2="400" y2="110" stroke="#0F2A4A" strokeWidth="1.5" />
              <line x1="360" y1="140" x2="400" y2="140" stroke="#0F2A4A" strokeWidth="1.5" />
              <line x1="360" y1="170" x2="400" y2="170" stroke="#0F2A4A" strokeWidth="1.5" />
              <line x1="360" y1="200" x2="400" y2="200" stroke="#0F2A4A" strokeWidth="1.5" />

              <text x="80" y="100" fill="#0F2A4A" fontSize="13" fontFamily="Playfair Display" fontWeight="bold">LIVING & LOUNGE</text>
              <text x="80" y="230" fill="#9B9B8E" fontSize="11" fontFamily="Inter">SUÍTE PRINCIPAL</text>
              <text x="200" y="230" fill="#9B9B8E" fontSize="11" fontFamily="Inter">CLOSET</text>
            </svg>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-warm-200 text-[11px] font-semibold text-navy-900 shadow-sm flex items-center gap-1.5">
              <Compass size={14} className="text-gold-500" /> Projeto Original Viva Belle 2011
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="bg-warm-50 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-2">
              Nossos Pilares
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
              Nossos valores fundamentais
            </h2>
            <p className="text-warm-500 text-sm mt-3">
              Princípios inegociáveis que orientam cada atendimento, avaliação e fechamento em nossa história.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((v, i) => {
              const Icon = v.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 shadow-card border border-warm-100 flex flex-col items-start transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold-50 flex items-center justify-center text-gold-500 mb-6">
                    <Icon size={30} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">
                    {v.title}
                  </h3>
                  <p className="text-warm-600 leading-relaxed text-sm">
                    {v.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section id="equipe" className="bg-white py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-2">
              Corretores Especialistas
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
              Nossa equipe de consultores
            </h2>
            <p className="text-warm-500 text-sm mt-3">
              Profissionais credenciados com profunda vivência nas regiões onde atuam e formação constante em negociação de alto padrão.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div
                key={member.id}
                className="bg-warm-50/60 rounded-2xl p-6 border border-warm-100 text-center flex flex-col items-center hover:bg-white hover:shadow-card transition duration-300"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-gold-500/40 p-1 bg-white shadow-sm">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-serif font-bold text-lg text-navy-900">{member.name}</h3>
                <p className="text-xs font-semibold text-gold-600 mt-1">{member.role}</p>
                <p className="text-xs text-warm-500 mt-1">{member.zone}</p>
                <span className="inline-block mt-2 text-[11px] font-mono font-medium text-warm-400 bg-warm-100 px-2.5 py-0.5 rounded">
                  {member.creci}
                </span>

                <a
                  href={`https://wa.me/5511999990000?text=${encodeURIComponent(
                    `Olá ${member.name}, encontrei seu perfil no site da Viva Belle Imobiliária e gostaria de conversar.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full justify-center mt-5 text-xs py-2 flex items-center gap-1.5 hover:border-gold-500 hover:text-gold-600"
                >
                  <MessageCircle size={14} className="text-emerald-600" />
                  Falar no WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="bg-navy-900 py-16 px-6 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className="pt-6 lg:pt-0 px-4">
                <p className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight">
                  {s.num}
                </p>
                <p className="text-gold-300 text-xs font-semibold uppercase tracking-widest mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onde Estamos */}
      <section className="bg-warm-50 py-20 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-warm-400 mb-2">
              Sede Principal
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
              Onde estamos
            </h2>
            <div className="space-y-4 text-warm-700 text-sm">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-100 shadow-sm">
                <MapPin size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-900">Jardins — São Paulo / SP</p>
                  <p className="text-warm-500 text-xs mt-0.5">Rua Oscar Freire, 820 - Conjunto 41, CEP 01426-001</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-100 shadow-sm">
                <Phone size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-900">Central Telefônica & WhatsApp</p>
                  <p className="text-warm-500 text-xs mt-0.5">(11) 3000-0000 | (11) 99999-0000</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-100 shadow-sm">
                <Mail size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-900">Atendimento Digital</p>
                  <p className="text-warm-500 text-xs mt-0.5">contato@vivabelle.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-warm-100 shadow-sm">
                <Clock size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-navy-900">Horário de Funcionamento</p>
                  <p className="text-warm-500 text-xs mt-0.5">Segunda a Sexta: 09h às 19h | Sábado: 09h às 14h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warm-200 rounded-2xl h-64 sm:h-80 flex flex-col items-center justify-center text-warm-600 border border-warm-300 p-6 text-center shadow-inner relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gold-600 mb-3 shadow-md">
              <MapPin size={32} />
            </div>
            <p className="font-serif font-bold text-navy-900 text-lg">Rua Oscar Freire, 820</p>
            <p className="text-xs text-warm-600 mt-1 max-w-xs">
              Esquina com Alameda Bela Cintra. Estacionamento com manobrista no local.
            </p>
            <a
              href="https://maps.google.com/?q=Rua+Oscar+Freire+820+Jardins+Sao+Paulo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary bg-navy-900 text-xs py-2 px-4 mt-4"
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gold-500 py-16 px-6 text-center text-white">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Pronto para encontrar seu próximo lar?
          </h2>
          <p className="text-white/90 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Nossos consultores estão prontos para oferecer uma assessoria imobiliária personalizada e exclusiva para sua família.
          </p>
          <div className="mt-8">
            <Link
              to="/imoveis"
              className="btn btn-secondary bg-navy-900 hover:bg-navy-950 text-white px-10 py-4 text-base font-semibold rounded-xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              Explorar imóveis disponíveis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
