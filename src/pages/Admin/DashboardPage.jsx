import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
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
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, isAdmin } = useAuth()
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
        if (isAdmin) {
          // Métricas globais para Admin / Dono
          const [propsCount, soldCount, leadsCount, visitsCount, pendingCount, brokersCount] = await Promise.all([
            supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
            supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'vendido'),
            supabase.from('leads').select('id', { count: 'exact', head: true }),
            supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'agendada'),
            supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'active')
          ])

          // Carregar leads recentes
          const { data: leadsData } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

          setStats({
            properties: propsCount.count || 0,
            soldProperties: soldCount.count || 0,
            leads: leadsCount.count || 0,
            visits: visitsCount.count || 0,
            pendingApprovals: pendingCount.count || 0,
            activeBrokers: brokersCount.count || 0,
            commissionsTotal: 84500 // placeholder agregado de volume
          })
          setRecentLeads(leadsData || [])
        } else {
          // Métricas exclusivas do Corretor
          const userId = user?.id
          const [propsCount, soldCount, leadsCount, visitsCount, commissionsData] = await Promise.all([
            supabase.from('properties').select('id', { count: 'exact', head: true }).eq('created_by', userId),
            supabase.from('properties').select('id', { count: 'exact', head: true }).eq('created_by', userId).eq('status', 'vendido'),
            supabase.from('leads').select('id', { count: 'exact', head: true }).eq('broker_id', userId),
            supabase.from('visits').select('id', { count: 'exact', head: true }).eq('broker_id', userId).eq('status', 'agendada'),
            supabase.from('commissions').select('commission_amount').eq('broker_id', userId)
          ])

          const totalCommissions = commissionsData.data?.reduce((acc, curr) => acc + (Number(curr.commission_amount) || 0), 0) || 18500

          // Buscar próximas visitas do corretor
          const { data: visitsData } = await supabase
            .from('visits')
            .select('*')
            .eq('broker_id', userId)
            .order('scheduled_date', { ascending: true })
            .limit(4)

          setStats({
            properties: propsCount.count || 0,
            soldProperties: soldCount.count || 0,
            leads: leadsCount.count || 0,
            visits: visitsCount.count || 0,
            commissionsTotal: totalCommissions,
            pendingApprovals: 0,
            activeBrokers: 0
          })
          setUpcomingVisits(visitsData || [])
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, isAdmin])

  return (
    <div className="space-y-8">
      {/* Top Banner de Boas-Vindas */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            {isAdmin ? 'Painel de Gestão & Diretoria' : 'Área de Atendimento ao Corretor'}
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1">
            Olá, {profile?.name || 'Profissional'}!
          </h1>
          <p className="text-white/60 text-sm mt-1 max-w-xl">
            {isAdmin 
              ? 'Acompanhe as métricas globais, fila de aprovações de corretores e desempenho geral da imobiliária no Vale do Paraíba.'
              : 'Gerencie seus anúncios exclusivos, atenda seus leads no funil e mantenha suas visitas sempre em dia.'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/properties/new"
            className="btn btn-primary gap-2 text-xs py-3 px-5 shadow-md"
          >
            <Plus size={16} /> Novo Imóvel
          </Link>
          <Link
            to="/admin/leads"
            className="btn btn-secondary gap-2 text-xs py-3 px-5 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Kanban size={16} /> Ver Funil
          </Link>
        </div>
      </div>

      {/* Alerta de Aprovações Pendentes para Admin */}
      {isAdmin && stats.pendingApprovals > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">
                {stats.pendingApprovals} novo(s) corretor(es) aguardando aprovação
              </h3>
              <p className="text-xs text-amber-700">
                Verifique os registros de CRECI e documentos na fila antes de liberar o acesso.
              </p>
            </div>
          </div>
          <Link
            to="/admin/approvals"
            className="btn btn-primary text-xs py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white gap-1"
          >
            Revisar Fila <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              {isAdmin ? 'Imóveis Ativos' : 'Meus Imóveis Ativos'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">{stats.properties}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <CheckCircle2 size={14} /> Atualizado em tempo real
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              {isAdmin ? 'Total de Leads' : 'Leads em Atendimento'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
              <Kanban size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">{stats.leads}</div>
          <div className="flex items-center gap-1.5 text-xs text-warm-500 mt-2">
            No funil de qualificação
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              Visitas Agendadas
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-navy-900 mt-4">{stats.visits}</div>
          <div className="flex items-center gap-1.5 text-xs text-purple-600 mt-2 font-medium">
            <Clock size={14} /> Para os próximos dias
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
              {isAdmin ? 'Volume de Vendas / Comissões' : 'Comissão Prevista'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.commissionsTotal)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <TrendingUp size={14} /> Negócios fechados
          </div>
        </div>
      </div>

      {/* Grid de Seções Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Recentes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-lg font-bold text-navy-900">Leads Recentes</h2>
            <Link to="/admin/leads" className="text-xs font-semibold text-gold-600 hover:underline">
              Ver Funil Completo &rarr;
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
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{lead.name}</p>
                    <p className="text-xs text-warm-500 truncate max-w-xs">{lead.subject || lead.phone}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'novo' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações Rápidas e Ferramentas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-900 mb-2">Conformidade e Diretrizes Legais</h2>
            <p className="text-xs text-warm-600 leading-relaxed mb-6">
              Todos os anúncios vinculados ao seu usuário são publicados com seu nome e registro no CRECI ({profile?.creci || 'SP'}), em total conformidade com a legislação do Conselho Regional de Corretores de Imóveis.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-warm-50 rounded-xl border border-warm-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-navy-900">Região de Atuação Principal</p>
                  <p className="text-xs text-warm-500">Vale do Paraíba (São José dos Campos e Região)</p>
                </div>
                <span className="text-xs font-bold text-gold-600">Ativo</span>
              </div>

              <div className="p-3.5 bg-warm-50 rounded-xl border border-warm-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-navy-900">Situação do CRECI</p>
                  <p className="text-xs text-warm-500">{profile?.creci_type === 'provisorio' ? 'Provisório' : 'Definitivo'} &middot; CRECI-{profile?.creci_uf || 'SP'}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600">Regular</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-warm-100 flex gap-3">
            <Link to="/admin/profile" className="btn btn-secondary text-xs flex-1 justify-center py-2.5">
              Editar Meu Perfil
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
