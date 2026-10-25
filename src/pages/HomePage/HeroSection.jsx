import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const [tab, setTab] = useState('comprar')
  const [form, setForm] = useState({ busca: '', tipo: '', preco: '', quartos: '' })
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tab === 'alugar') params.set('tipo', 'aluguel')
    else params.set('tipo', 'venda')
    if (form.tipo) params.set('categoria', form.tipo)
    navigate(`/imoveis?${params.toString()}`)
  }

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden">
      {/* Background photo */}
      <img
        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80"
        alt="Imóvel de alto padrão no Vale do Paraíba"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Dual gradient overlay */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(9,27,51,0.55) 0%, rgba(9,27,51,0.80) 60%, rgba(9,27,51,0.95) 100%)'}} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6" style={{paddingBottom: '160px'}}>
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-300 mb-4">
          Vale do Paraíba · Médio e Alto Padrão
        </p>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] max-w-3xl" style={{textWrap: 'balance'}}>
          Seu novo capítulo<br />começa aqui.
        </h1>
        <p className="text-lg md:text-xl font-light text-white/70 mt-6 max-w-xl leading-relaxed">
          Mais de 1.400 imóveis de médio e alto padrão no Vale do Paraíba. Com atendimento humano do início ao fim.
        </p>
      </div>

      {/* Search bar - floating, overlaps next section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6" style={{transform: 'translateY(50%)'}}>
        <form onSubmit={handleSearch} className="max-w-[900px] mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-warm-100 px-2 pt-2">
            {[['comprar', 'Comprar'], ['alugar', 'Alugar']].map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTab(val)}
                className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  tab === val
                    ? 'border-gold-500 text-navy-900'
                    : 'border-transparent text-warm-400 hover:text-warm-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Fields */}
          <div className="flex flex-wrap md:flex-nowrap items-stretch">
            <div className="flex items-center flex-1 min-w-[180px] px-4 py-3 gap-3">
              <Search size={18} className="text-warm-400 flex-none" />
              <input
                type="text"
                placeholder="Bairro, rua ou endereço..."
                value={form.busca}
                onChange={e => setForm(f => ({...f, busca: e.target.value}))}
                className="flex-1 bg-transparent border-0 outline-none text-sm text-warm-900 placeholder-warm-400 min-w-0"
              />
            </div>
            <div className="w-px bg-warm-100 self-stretch my-3" />
            <select
              value={form.tipo}
              onChange={e => setForm(f => ({...f, tipo: e.target.value}))}
              className="border-0 outline-none bg-transparent text-sm text-warm-600 px-4 py-3 cursor-pointer min-w-0"
            >
              <option value="">Tipo de imóvel</option>
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Cobertura</option>
              <option>Studio</option>
              <option>Sala Comercial</option>
            </select>
            <div className="w-px bg-warm-100 self-stretch my-3" />
            <select
              value={form.preco}
              onChange={e => setForm(f => ({...f, preco: e.target.value}))}
              className="border-0 outline-none bg-transparent text-sm text-warm-600 px-4 py-3 cursor-pointer min-w-0"
            >
              <option value="">Faixa de preço</option>
              <option>Até R$ 500k</option>
              <option>R$ 500k – R$ 1M</option>
              <option>R$ 1M – R$ 2M</option>
              <option>R$ 2M – R$ 5M</option>
              <option>Acima de R$ 5M</option>
            </select>
            <div className="w-px bg-warm-100 self-stretch my-3" />
            <select
              value={form.quartos}
              onChange={e => setForm(f => ({...f, quartos: e.target.value}))}
              className="border-0 outline-none bg-transparent text-sm text-warm-600 px-4 py-3 cursor-pointer min-w-0"
            >
              <option value="">Quartos</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
            </select>
            <div className="p-3">
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm px-8 h-full rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors duration-200"
                style={{minHeight: 48}}
              >
                <Search size={16} /> Buscar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={24} className="text-white/40" />
      </div>
    </section>
  )
}
