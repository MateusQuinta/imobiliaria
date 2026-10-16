import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactForm } from '../../lib/api'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Comprar um imóvel',
    mensagem: '',
    aceite: true,
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitContactForm(formData)

      setSubmitted(true)
      toast.success(`Obrigado pelo contato, ${formData.nome}! Sua mensagem foi enviada com sucesso.`)

      if (result.fallback) {
        console.log('Form submitted in fallback mode (Supabase not configured)')
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEOHelmet title="Fale Conosco" description="Entre em contato com a Viva Belle Imobiliária. Visite nosso escritório nos Jardins, ligue ou envie mensagem pelo WhatsApp. Atendimento humano e transparente." path="/contato" />
      <Header />

      {/* Hero */}
      <section className="bg-navy-900 pt-32 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-300 mb-2">
            Canais de Atendimento
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Fale conosco
          </h1>
          <p className="text-white/60 mt-2 text-base max-w-xl">
            Estamos à disposição para atendê-lo com discrição, agilidade e excelência. Escolha o canal de sua preferência.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-warm-50 py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Coluna Esquerda: Informações e Contatos */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">
              Como nos encontrar
            </h2>

            <div className="space-y-4">
              {/* Card 1: Endereço */}
              <div className="bg-white rounded-xl p-5 shadow-card flex gap-4 items-start border border-warm-100">
                <div className="w-11 h-11 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">Nosso Escritório</h3>
                  <p className="text-warm-600 text-sm mt-1 leading-relaxed">
                    Rua Oscar Freire, 820 - cj 41, Jardins<br />
                    São Paulo - SP, CEP 01426-001
                  </p>
                </div>
              </div>

              {/* Card 2: Telefone */}
              <div className="bg-white rounded-xl p-5 shadow-card flex gap-4 items-start border border-warm-100">
                <div className="w-11 h-11 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">Telefone Fixo</h3>
                  <p className="text-warm-600 text-sm mt-1">
                    <a href="tel:1130000000" className="hover:text-navy-900 font-medium">
                      (11) 3000-0000
                    </a>
                  </p>
                  <p className="text-xs text-warm-400 mt-0.5">Seg–Sex 9h–19h, Sáb 9h–14h</p>
                </div>
              </div>

              {/* Card 3: WhatsApp */}
              <div className="bg-white rounded-xl p-5 shadow-card flex gap-4 items-start border border-warm-100">
                <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">WhatsApp Oficial</h3>
                  <p className="text-warm-600 text-sm mt-1">
                    <a
                      href="https://wa.me/5511999990000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      (11) 99999-0000
                    </a>
                  </p>
                  <p className="text-xs text-warm-400 mt-0.5">Atendimento rápido com consultores de plantão</p>
                </div>
              </div>

              {/* Card 4: E-mail */}
              <div className="bg-white rounded-xl p-5 shadow-card flex gap-4 items-start border border-warm-100">
                <div className="w-11 h-11 rounded-lg bg-gold-50 flex items-center justify-center text-gold-500 flex-shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 text-sm">E-mail</h3>
                  <p className="text-warm-600 text-sm mt-1">
                    <a href="mailto:contato@vivabelle.com.br" className="hover:text-navy-900 font-medium">
                      contato@vivabelle.com.br
                    </a>
                  </p>
                  <p className="text-xs text-warm-400 mt-0.5">Respondemos em até 2 horas úteis</p>
                </div>
              </div>
            </div>

            {/* Mapa Placeholder */}
            <div className="bg-warm-200 rounded-2xl h-60 mt-6 flex flex-col items-center justify-center text-warm-600 gap-2 border border-warm-300 p-6 text-center relative overflow-hidden">
              <MapPin size={36} className="text-gold-600" />
              <p className="font-serif font-bold text-navy-900 text-base">Jardins — São Paulo / SP</p>
              <p className="text-xs text-warm-500 max-w-xs">
                Rua Oscar Freire, 820 · Valet com manobrista na entrada do edifício
              </p>
              <a
                href="https://maps.google.com/?q=Rua+Oscar+Freire+820+Jardins+Sao+Paulo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs font-semibold text-navy-900 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-warm-300 hover:bg-white transition"
              >
                Ver localização no mapa
              </a>
            </div>

            {/* Tabela de horários */}
            <div className="mt-6 bg-white rounded-xl p-5 shadow-card border border-warm-100">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-warm-100">
                <Clock size={18} className="text-gold-500" />
                <h3 className="font-semibold text-navy-900 text-sm">Horário de Atendimento</h3>
              </div>
              <ul className="space-y-2 text-sm text-warm-600">
                <li className="flex justify-between items-center">
                  <span>Segunda a Sexta</span>
                  <span className="font-semibold text-navy-900">09:00 às 19:00</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Sábado</span>
                  <span className="font-semibold text-navy-900">09:00 às 14:00</span>
                </li>
                <li className="flex justify-between items-center text-warm-400">
                  <span>Domingo e Feriados</span>
                  <span className="font-medium text-warm-500">Fechado (Plantão WhatsApp)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coluna Direita: Formulário */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-card border border-warm-100">
              <h3 className="font-serif text-2xl font-bold text-navy-900">Envie uma mensagem</h3>
              <p className="text-warm-500 text-sm mt-1 mb-6">
                Preencha o formulário abaixo e um corretor especialista entrará em contato em menos de 2 horas.
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-navy-900 mb-2">Mensagem enviada com sucesso!</h4>
                  <p className="text-warm-600 text-sm max-w-sm mx-auto mb-6">
                    Agradecemos pelo contato. Nossa equipe já recebeu sua solicitação e responderá o mais breve possível.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        nome: '',
                        email: '',
                        telefone: '',
                        assunto: 'Comprar um imóvel',
                        mensagem: '',
                        aceite: true,
                      })
                    }}
                    className="btn btn-ghost"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      id="nome"
                      type="text"
                      required
                      placeholder="Ex: Carolina Almeida"
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                        E-mail *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefone" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="telefone"
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={formData.telefone}
                        onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      value={formData.assunto}
                      onChange={e => setFormData({ ...formData, assunto: e.target.value })}
                      className="input-field cursor-pointer"
                    >
                      <option value="Comprar um imóvel">Quero Comprar um Imóvel</option>
                      <option value="Alugar um imóvel">Quero Alugar um Imóvel</option>
                      <option value="Vender meu imóvel">Quero Avaliar / Vender meu Imóvel</option>
                      <option value="Lançamentos">Conhecer Lançamentos Exclusivos</option>
                      <option value="Dúvida geral">Dúvidas Gerais ou Parcerias</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-xs font-semibold uppercase tracking-wider text-warm-600 mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      rows={5}
                      required
                      placeholder="Descreva detalhes como bairro desejado, faixa de valor ou características importantes..."
                      value={formData.mensagem}
                      onChange={e => setFormData({ ...formData, mensagem: e.target.value })}
                      className="input-field resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-warm-600 leading-normal">
                      <input
                        type="checkbox"
                        checked={formData.aceite}
                        onChange={e => setFormData({ ...formData, aceite: e.target.checked })}
                        className="accent-gold-500 rounded mt-0.5"
                      />
                      <span>Aceito receber comunicações personalizadas por e-mail e WhatsApp de acordo com as diretrizes de privacidade.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-4 text-base font-semibold justify-center flex items-center gap-2 mt-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Seção CTA WhatsApp */}
      <section className="bg-white py-12 px-6 border-t border-warm-100">
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
          <p className="text-warm-600 text-lg font-medium mb-3">
            Prefere falar agora com um de nossos corretores?
          </p>
          <a
            href="https://wa.me/5511999990000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-white px-10 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-3 shadow-md hover:opacity-95 transition"
            style={{ background: '#25D366' }}
          >
            <MessageCircle size={24} />
            Conversar no WhatsApp agora
          </a>
          <p className="text-xs text-warm-400 mt-3">
            Tempo médio de resposta: menos de 5 minutos em horário comercial
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
