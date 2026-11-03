import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import {
  getMockProperties,
  getMockLeads,
  getMockBrokers,
  getMockVisits,
  getMockCommissions
} from '../../lib/localAuth'
import {
  Building2,
  Kanban,
  Calendar,
  DollarSign,
  UserCheck,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, isAdmin, isLocalMode } = useAuth()
  const [stats, setStats] = useState({
    properties: 0,
    soldProperties: 0,
    leads: 0,
    visits: 0,
    commissionsTotal: 0,
    pendingApprovals: 0,
    activeBrokers: 0
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingVisits, setUpcomingVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        if (isLocalMode) {
          // === Modo Local — dados mock ===
          const userId = profile?.id
          const allProps = getMockProperties(isAdmin ? null : userId)
          const allLeads = getMockLeads(isAdmin ? null : userId)
          const allVisits = getMockVisits(isAdmin ? null : userId)
          const allComms = getMockCommissions(isAdmin ? null : userId)
          const allBrokers = getMockBrokers()

          setStats({
            properties: allProps.filter(p => p.status === 'ativo').length,
            soldProperties: allProps.filter(p => p.status === 'vendido').length,
            leads: allLeads.length,
            visits: allVisits.filter(v => v.status === 'agendada').length,
            commissionsTotal: allComms.reduce((s, c) => s + (c.commission_amount || 0), 0),
            pendingApprovals: isAdmin ? allBrokers.filter(b => b.status === 'pending').length : 0,
            activeBrokers: isAdmin ? allBrokers.filter(b => b.status === 'active').length : 0
          })
          setRecentLeads(allLeads.slice(0, 5))
          setUpcomingVisits(allVisits.slice(0, 4))
        } else {
          // === Modo Supabase ===
          if (isAdmin) {
            const [propsCount, soldCount, leadsCount, visitsCount, pendingCount, brokersCount] = await Promise.all([
              supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
              supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'vendido'),
              supabase.from('leads').select('id', { count: 'exact', head: true }),
              supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'agendada'),
              supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
              supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'active')
            ])
            const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)

            setStats({
              properties: propsCount.count || 0,
              soldProperties: soldCount.count || 0,
              leads: leadsCount.count || 0,
              visits: visitsCount.count || 0,
              pendingApprovals: pendingCount.count || 0,
              activeBrokers: brokersCount.count || 0,
              commissionsTotal: 84500
            })
            setRecentLeads(leadsData || [])
          } else {
            const userId = user?.id
            const [propsCount, soldCount, leadsCount, visitsCount, commissionsData] = await Promise.all([
              supabase.from('properties').select('id', { count: 'exact', head: true }).eq('created_by', userId),
              supabase.from('properties').select('id', { count: 'exact', head: true }).eq('created_by', userId).eq('status', 'vendido'),
              supabase.from('leads').select('id', { count: 'exact', head: true }).eq('broker_id', userId),
              supabase.from('visits').select('id', { count: 'exact', head: true }).eq('broker_id', userId).eq('status', 'agendada'),
              supabase.from('commissions').select('commission_amount').eq('broker_id', userId)
            ])
            const totalComm = commissionsData.data?.reduce((acc, c) => acc + (Number(c.commission_amount) || 0), 0) || 0
            const { data: visitsData } = await supabase.from('visits').select('*').eq('broker_id', userId).order('scheduled_date', { ascending: true }).limit(4)

            setStats({
              properties: propsCount.count || 0,
              soldProperties: soldCount.count || 0,
              leads: leadsCount.count || 0,
              visits: visitsCount.count || 0,
              commissionsTotal: totalComm,
              pendingApprovals: 0,
              activeBrokers: 0
            })
            setUpcomingVisits(visitsData || [])
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (profile) loadDashboardData()
  }, [user, profile, isAdmin, isLocalMode])

  const fmtBRL = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

  const statusBadge = {
    novo: 'bg-amber-100 text-amber-800',
    em_contato: 'bg-blue-100 text-blue-800',
    visita_agendada: 'bg-purple-100 text-purple-800',
    proposta: 'bg-orange-100 text-orange-800',
    fechado: 'bg-emerald-100 text-emerald-800',
    perdido: 'bg-red-100 text-red-800'
  }
  const statusLabel = {
    novo: 'Novo', em_contato: 'Em contato', visita_agendada: 'Visita', proposta: 'Proposta',
    fechado: 'Fechado', perdido: 'Perdido'
  }

  return (
    <div className="space-y-8">
      {/* Banner de boas-vindas */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            {isAdmin ? 'Painel de Gestão & Diretoria' : 'Área do Corretor'}
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1">
            Olá, {profile?.name || 'Profissional'}!
          </h1>
          <p className="text-white/60 text-sm mt-1 max-w-xl">
            {isAdmin
              ? 'Acompanhe as métricas globais, fila de aprovações e desempenho geral no Vale do Paraíba.'
              : 'Gerencie seus anúncios, atenda leads e mantenha suas visitas sempre em dia.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLocalMode && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full">
              <WifiOff size={11} /> Modo Demo
            </span>
          )}
          <Link to="/admin/properties/new" className="btn btn-primary gap-2 text-xs py-3 px-5 shadow-md">
            <Plus size={16} /> Novo Imóvel
          </Link>
          <Link to="/admin/leads" className="btn btn-secondary gap-2 text-xs py-3 px-5 bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Kanban size={16} /> Ver Funil
          </Link>
        </div>
      </div>

      {/* Alerta de aprovações pendentes */}
      {isAdmin && stats.pendingApprovals > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">
                {stats.pendingApprovals} corretor(es) aguardando aprovação
              </h3>
              <p className="text-xs text-amber-700">
                Verifique os documentos de CRECI antes de liberar o acesso.
              </p>
            </div>
          </div>
          <Link to="/admin/approvals" className="btn btn-primary text-xs py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white gap-1">
            Revisar Fila <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={isAdmin ? 'Imóveis Ativos' : 'Meus Imóveis Ativos'}
          value={loading ? '...' : stats.properties}
          icon={<Building2 size={20} />}
          iconBg="bg-navy-50 text-navy-800"
          sub={<span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={13} /> Tempo real</span>}
        />
        <StatCard
          label={isAdmin ? 'Total de Leads' : 'Leads em Atendimento'}
          value={loading ? '...' : stats.leads}
          icon={<Kanban size={20} />}
          iconBg="bg-gold-50 text-gold-600"
          sub="No funil de qualificação"
        />
        <StatCard
          label="Visitas Agendadas"
          value={loading ? '...' : stats.visits}
          icon={<Calendar size={20} />}
          iconBg="bg-purple-50 text-purple-600"
          sub={<span className="flex items-center gap-1 text-purple-600"><Clock size={13} /> Próximos dias</span>}
        />
        <StatCard
          label={isAdmin ? 'Volume / Comissões' : 'Comissão Prevista'}
          value={loading ? '...' : fmtBRL(stats.commissionsTotal)}
          icon={<DollarSign size={20} />}
          iconBg="bg-emerald-50 text-emerald-600"
          sub={<span className="flex items-center gap-1 text-emerald-600"><TrendingUp size={13} /> Negócios fechados</span>}
          large
        />
      </div>

      {/* Admin: cards extras */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            label="Corretores Ativos"
            value={loading ? '...' : stats.activeBrokers}
            icon={<Users size={20} />}
            iconBg="bg-blue-50 text-blue-600"
            sub={<Link to="/admin/brokers" className="text-blue-600 hover:underline">Ver todos</Link>}
          />
          <StatCard
            label="Imóveis Vendidos"
            value={loading ? '...' : stats.soldProperties}
            icon={<CheckCircle2 size={20} />}
            iconBg="bg-emerald-50 text-emerald-600"
            sub="Total no período"
          />
        </div>
      )}

      {/* Grid inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads recentes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-lg font-bold text-navy-900">Leads Recentes</h2>
            <Link to="/admin/leads" className="text-xs font-semibold text-gold-600 hover:underline">
              Ver Funil →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-warm-400 text-sm">
              Nenhum lead pendente no momento.
            </div>
          ) : (
            <div className="divide-y divide-warm-100">
              {recentLeads.map(lead => (
                <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900 truncate">{lead.name}</p>
                    <p className="text-xs text-warm-500 truncate">{lead.subject || lead.phone}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusBadge[lead.status] || 'bg-warm-100 text-warm-700'}`}>
                    {statusLabel[lead.status] || lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Próximas visitas / Conformidade */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200 flex flex-col justify-between">
          {upcomingVisits.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-lg font-bold text-navy-900">Próximas Visitas</h2>
                <Link to="/admin/visits" className="text-xs font-semibold text-gold-600 hover:underline">
                  Ver agenda →
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingVisits.map(v => (
                  <div key={v.id} className="p-3.5 bg-warm-50 rounded-xl border border-warm-100">
                    <p className="text-xs font-bold text-navy-900">{v.lead_name}</p>
                    <p className="text-xs text-warm-500 mt-0.5 truncate">{v.property_title}</p>
                    <p className="text-xs text-purple-600 font-semibold mt-1">
                      {v.scheduled_date} às {v.scheduled_time}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-serif text-lg font-bold text-navy-900 mb-2">Conformidade Legal</h2>
                <p className="text-xs text-warm-600 leading-relaxed mb-6">
                  Todos os anúncios publicados em seu nome exibem obrigatoriamente seu CRECI-{profile?.creci_uf || 'SP'}, em conformidade com a legislação do Conselho Regional de Corretores de Imóveis.
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 bg-warm-50 rounded-xl border border-warm-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-navy-900">Região de Atuação</p>
                      <p className="text-xs text-warm-500">Taubaté e Vale do Paraíba</p>
                    </div>
                    <span className="text-xs font-bold text-gold-600">Ativo</span>
                  </div>
                  <div className="p-3.5 bg-warm-50 rounded-xl border border-warm-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-navy-900">CRECI</p>
                      <p className="text-xs text-warm-500">
                        {profile?.creci_type === 'provisorio' ? 'Provisório' : 'Definitivo'} · CRECI-{profile?.creci_uf || 'SP'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Regular</span>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-6 pt-4 border-t border-warm-100 flex gap-3">
            <Link to="/admin/profile" className="btn btn-secondary text-xs flex-1 justify-center py-2.5">
              Editar Perfil
            </Link>
            <Link to="/admin/properties/new" className="btn btn-primary text-xs flex-1 justify-center py-2.5">
              Cadastrar Imóvel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, iconBg, sub, large = false }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className={`font-bold text-navy-900 mt-4 ${large ? 'text-2xl' : 'text-3xl'}`}>{value}</div>
      <div className="flex items-center gap-1.5 text-xs text-warm-500 mt-2">{sub}</div>
    </div>
  )
}
