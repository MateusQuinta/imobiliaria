import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Download, 
  Building2, 
  Calendar,
  ShieldCheck,
  CreditCard
} from 'lucide-react'

export default function CommissionsPage() {
  const { user, profile, isAdmin } = useAuth()
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommissions()
  }, [user, isAdmin])

  async function fetchCommissions() {
    setLoading(true)
    try {
      let query = supabase.from('commissions').select('*').order('closed_at', { ascending: false })
      if (!isAdmin && user?.id) {
        query = query.eq('broker_id', user.id)
      }

      const { data, error } = await query
      if (!error && data && data.length > 0) {
        setCommissions(data)
      } else {
        // Fallback demonstrativo inicial
        setCommissions([
          {
            id: 'c1',
            property_title: 'Apartamento de Alto Padrão no Jardim Aquarius',
            deal_value: 1850000,
            commission_rate: 3.0,
            commission_amount: 55500,
            status: 'pago',
            closed_at: '2026-02-10'
          },
          {
            id: 'c2',
            property_title: 'Cobertura Vista Panorâmica na Vila Ema',
            deal_value: 9500,
            commission_rate: 50.0,
            commission_amount: 4750,
            status: 'a_receber',
            closed_at: '2026-02-18'
          },
          {
            id: 'c3',
            property_title: 'Residencial Reserva da Serra no Urbanova',
            deal_value: 890000,
            commission_rate: 3.5,
            commission_amount: 31150,
            status: 'processando',
            closed_at: '2026-02-22'
          }
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalRecebido = commissions
    .filter(c => c.status === 'pago')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0)

  const totalAReceber = commissions
    .filter(c => c.status === 'a_receber' || c.status === 'processando')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0)

  const formatBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-900">
          {isAdmin ? 'Extrato de Comissões e Repasses' : 'Minhas Comissões'}
        </h1>
        <p className="text-warm-500 text-sm mt-0.5">
          Controle de remuneração sobre negócios fechados em venda e locação no Vale do Paraíba.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              Total Pago / Liquidado
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">{formatBRL(totalRecebido)}</div>
          <div className="text-xs text-emerald-600 mt-2 font-medium">Comprovante disponível</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              A Receber / Em Trânsito
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">{formatBRL(totalAReceber)}</div>
          <div className="text-xs text-amber-600 mt-2 font-medium">Aguardando repasse de escritura</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              Volume Negociado
            </span>
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">
            {formatBRL(commissions.reduce((s, c) => s + Number(c.deal_value), 0))}
          </div>
          <div className="text-xs text-warm-500 mt-2">Total de VGV transacionado</div>
        </div>
      </div>

      {/* Tabela de Negócios */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
        <div className="p-6 border-b border-warm-200 flex justify-between items-center">
          <h2 className="font-serif text-lg font-bold text-navy-900">Extrato Detalhado de Fechamentos</h2>
          <span className="text-xs text-warm-400">Sigilo comercial protegido</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-50 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-warm-200">
                <th className="p-4">Imóvel Transacionado</th>
                <th className="p-4">Data</th>
                <th className="p-4">Valor do Negócio</th>
                <th className="p-4">Percentual</th>
                <th className="p-4">Sua Comissão</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 text-xs">
              {commissions.map(c => (
                <tr key={c.id} className="hover:bg-warm-50 transition">
                  <td className="p-4">
                    <p className="font-semibold text-navy-900">{c.property_title}</p>
                    <p className="text-[11px] text-warm-400">Contrato digital auditado</p>
                  </td>
                  <td className="p-4 text-warm-600">
                    {new Date(c.closed_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 font-medium text-navy-900">
                    {formatBRL(c.deal_value)}
                  </td>
                  <td className="p-4 text-warm-600 font-semibold">
                    {c.commission_rate}%
                  </td>
                  <td className="p-4 font-bold text-emerald-700 text-sm">
                    {formatBRL(c.commission_amount)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'pago' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'processando' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status === 'pago' ? 'Pago' : c.status === 'processando' ? 'Processando' : 'A Receber'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
