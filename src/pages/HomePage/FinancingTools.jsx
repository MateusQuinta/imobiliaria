import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

function Slider({ label, value, onChange, min, max, step, display }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-warm-700">{label}</label>
        <span className="text-sm font-semibold text-gold-600">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full outline-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #C9952A ${((value-min)/(max-min))*100}%, #E0DBD3 ${((value-min)/(max-min))*100}%)`
        }}
      />
    </div>
  )
}

export default function FinancingTools() {
  const [tab, setTab] = useState('simulador')

  // Simulador state
  const [propVal, setPropVal] = useState(800000)
  const [downPct, setDownPct] = useState(30)
  const [termYrs, setTermYrs] = useState(30)
  const RATE = 0.105 // 10.5% a.a.

  const sim = useMemo(() => {
    const financed = propVal * (1 - downPct / 100)
    const r = RATE / 12
    const n = termYrs * 12
    const pmt = financed * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = pmt * n
    return {
      down: propVal * downPct / 100,
      financed,
      pmt,
      totalPaid,
      totalInterest: totalPaid - financed,
      principalPct: Math.round((financed / totalPaid) * 100),
    }
  }, [propVal, downPct, termYrs])

  // Poder de compra state
  const [income, setIncome] = useState(15000)
  const [pcDownPct, setPcDownPct] = useState(30)

  const power = useMemo(() => {
    const maxPmt = income * 0.30
    const r = RATE / 12
    const n = 30 * 12
    const maxLoan = maxPmt * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
    const maxProp = maxLoan / (1 - pcDownPct / 100)
    return { maxPmt, maxLoan, maxProp }
  }, [income, pcDownPct])

  return (
    <section className="bg-white py-20 px-6">
      <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#C9952A;cursor:pointer;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2)}input[type=range]{-webkit-appearance:none;appearance:none}`}</style>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-3">Ferramentas</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">Planeje a compra do seu imóvel</h2>
          <p className="text-warm-500 mt-3 max-w-lg leading-relaxed">Simule seu financiamento ou descubra até quanto você pode gastar com base na sua renda.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-warm-200 mb-10 gap-0">
          {[['simulador','Simulador de Financiamento'],['poder','Poder de Compra']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === id ? 'border-gold-500 text-navy-900' : 'border-transparent text-warm-400 hover:text-warm-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'simulador' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Inputs */}
            <div className="flex flex-col gap-8">
              <Slider label="Valor do imóvel" value={propVal} onChange={setPropVal} min={100000} max={5000000} step={50000} display={fmtBRL(propVal)} />
              <Slider label="Entrada" value={downPct} onChange={setDownPct} min={10} max={80} step={5} display={`${downPct}% = ${fmtBRL(sim.down)}`} />
              <Slider label="Prazo" value={termYrs} onChange={setTermYrs} min={5} max={30} step={1} display={`${termYrs} anos (${termYrs*12} parcelas)`} />
              <div className="bg-warm-50 rounded-xl px-5 py-3 text-sm text-warm-600 flex justify-between">
                <span>Taxa de juros (CET estimado)</span>
                <span className="font-semibold text-navy-900">10,5% a.a.</span>
              </div>
              <p className="text-xs text-warm-400">Sistema Price. Sujeito a análise de crédito.</p>
            </div>

            {/* Results */}
            <div className="bg-navy-900 rounded-2xl p-8 text-white sticky top-24">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-300 mb-4">Sua estimativa</p>
              <p className="font-serif text-5xl font-bold text-gold-300">{fmtBRL(sim.pmt)}</p>
              <p className="text-white/50 text-sm mt-1">por mês</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  ['Total financiado', fmtBRL(sim.financed)],
                  ['Entrada', fmtBRL(sim.down)],
                  ['Total pago', fmtBRL(sim.totalPaid)],
                  ['Total em juros', fmtBRL(sim.totalInterest)],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-white/40">{label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Principal ({sim.principalPct}%)</span>
                  <span>Juros ({100-sim.principalPct}%)</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 rounded-full transition-all duration-500" style={{width: `${sim.principalPct}%`}} />
                </div>
              </div>
              <a
                href="https://wa.me/5511999990000"
                target="_blank" rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-gold-400 text-gold-300 hover:bg-gold-500/20 transition w-full"
              >
                <MessageCircle size={16} /> Falar com especialista
              </a>
            </div>
          </div>
        )}

        {tab === 'poder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-8">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">Renda mensal bruta</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 text-sm font-medium">R$</span>
                  <input
                    type="number" value={income} onChange={e => setIncome(Number(e.target.value))}
                    className="input-field pl-10"
                    min={1000} step={500}
                  />
                </div>
                <p className="text-xs text-warm-400 mt-2">O Banco Central limita o comprometimento de renda a 30% para financiamentos.</p>
              </div>
              <Slider label="Entrada disponível" value={pcDownPct} onChange={setPcDownPct} min={10} max={80} step={5} display={`${pcDownPct}%`} />
              <div className="bg-warm-50 rounded-xl p-4 text-sm flex flex-col gap-1">
                <div className="flex justify-between"><span className="text-warm-500">Parcela máxima</span><span className="font-semibold text-navy-900">{fmtBRL(power.maxPmt)}/mês</span></div>
                <div className="flex justify-between"><span className="text-warm-500">Prazo considerado</span><span className="font-semibold text-navy-900">30 anos</span></div>
                <div className="flex justify-between"><span className="text-warm-500">Taxa</span><span className="font-semibold text-navy-900">10,5% a.a.</span></div>
              </div>
            </div>

            <div className="bg-navy-900 rounded-2xl p-8 text-white sticky top-24">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-300 mb-4">Você pode comprar até</p>
              <p className="font-serif text-5xl font-bold text-gold-300">{fmtBRL(power.maxProp)}</p>
              <p className="text-white/50 text-sm mt-2">Valor estimado do imóvel</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 mb-3">Imóveis dentro do seu perfil</p>
                <Link to="/imoveis" className="mt-2 text-sm font-semibold text-gold-300 hover:text-gold-200 transition flex items-center gap-1">
                  Ver imóveis disponíveis →
                </Link>
              </div>
              <a
                href="https://wa.me/5511999990000"
                target="_blank" rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-gold-400 text-gold-300 hover:bg-gold-500/20 transition w-full"
              >
                <MessageCircle size={16} /> Falar com especialista
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
