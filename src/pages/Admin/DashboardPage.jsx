import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Building, MessageSquare, Users, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    pendingApprovals: 0,
    activeAdmins: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [propsCount, leadsCount, pendingCount, adminsCount] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('contact_forms').select('id', { count: 'exact', head: true }),
          supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('admin_users').select('id', { count: 'exact', head: true }).eq('status', 'active')
        ])

        setStats({
          properties: propsCount.count || 0,
          leads: leadsCount.count || 0,
          pendingApprovals: pendingCount.count || 0,
          activeAdmins: adminsCount.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Imóveis Ativos', value: stats.properties, icon: Building, color: 'bg-navy-900' },
    { label: 'Leads Recebidos', value: stats.leads, icon: MessageSquare, color: 'bg-gold-500' },
    { label: 'Aprovações Pendentes', value: stats.pendingApprovals, icon: Users, color: 'bg-warm-500' },
    { label: 'Admins Ativos', value: stats.activeAdmins, icon: CheckCircle, color: 'bg-green-600' }
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="text-warm-500">Carregando estatísticas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <card.icon size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-navy-900">{card.value}</div>
              <div className="text-sm text-warm-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-navy-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-secondary justify-center">Novo Imóvel</button>
          <button className="btn btn-secondary justify-center">Ver Leads</button>
          <button className="btn btn-secondary justify-center">Aprovar Admins</button>
        </div>
      </div>
    </div>
  )
}
