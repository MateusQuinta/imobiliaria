import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

const BENEFITS = [
  'Avaliação gratuita em até 48h',
  'Fotos profissionais sem custo',
  'Alcance de mais de 10.000 compradores',
  'Corretor dedicado do anúncio ao fechamento',
]

export default function ListingCTA() {
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '', tipo: '', objetivo: '' })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    alert('Recebemos sua solicitação! Em breve entraremos em contato.')
    setForm({ nome: '', telefone: '', endereco: '', tipo: '', objetivo: '' })
  }

  return (
    <section className="bg-warm-50 py-20 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-4">Para proprietários</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight">Tem um imóvel para vender ou alugar?</h2>
          <p className="text-warm-600 mt-5 leading-relaxed text-base">
            Nossa equipe faz uma avaliação completa e gratuita do seu imóvel, cria um anúncio profissional e conduz todo o processo com transparência até o fechamento do contrato.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-3 text-warm-700">
                <CheckCircle size={20} className="text-gold-500 flex-none" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 bg-navy-900 rounded-2xl p-6 text-white">
            <p className="font-serif text-2xl font-semibold">98% dos nossos imóveis</p>
            <p className="text-white/60 mt-1 text-sm">vendem ou alugam em menos de 60 dias</p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <h3 className="font-serif text-2xl font-semibold text-navy-900 mb-6">Solicite uma avaliação gratuita</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input className="input-field" type="text" placeholder="Nome completo *" value={form.nome} onChange={set('nome')} required />
            <input className="input-field" type="tel" placeholder="Telefone / WhatsApp *" value={form.telefone} onChange={set('telefone')} required />
            <input className="input-field" type="text" placeholder="Endereço do imóvel *" value={form.endereco} onChange={set('endereco')} required />
            <select className="input-field" value={form.tipo} onChange={set('tipo')} required>
              <option value="">Tipo do imóvel *</option>
              <option>Apartamento</option><option>Casa</option><option>Cobertura</option><option>Terreno</option><option>Sala Comercial</option>
            </select>
            <select className="input-field" value={form.objetivo} onChange={set('objetivo')} required>
              <option value="">Objetivo *</option>
              <option>Quero vender</option><option>Quero alugar</option><option>Quero os dois</option>
            </select>
            <button type="submit" className="btn btn-primary w-full py-4 text-base justify-center mt-2">Solicitar avaliação gratuita</button>
            <p className="text-xs text-warm-400 text-center">Seus dados são protegidos. Respondemos em até 2h.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
