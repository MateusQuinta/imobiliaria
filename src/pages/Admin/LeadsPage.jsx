import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLeads()
  }, [filter])

  async function fetchLeads() {
    setLoading(true)
    try {
      let query = supabase.from('contact_forms').select('*').order('created_at', { ascending: false })
      
      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      
      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      toast.error('Erro ao carregar leads')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkResolved(id) {
    try {
      const { error } = await supabase
        .from('contact_forms')
        .update({ status: 'resolvido' })
        .eq('id', id)
      
      if (error) throw error
      toast.success('Lead marcado como resolvido')
      fetchLeads()
    } catch (error) {
      toast.error('Erro ao atualizar lead')
      console.error(error)
    }
  }

  const statusColors = {
    pendente: 'bg-yellow-100 text-yellow-700',
    resolvido: 'bg-green-100 text-green-700'
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Leads</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-warm-200">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="resolvido">Resolvido</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-warm-500">Carregando...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-warm-500">Nenhum lead encontrado</div>
        ) : (
          <div className="divide-y divide-warm-200">
            {leads.map(lead => (
              <div key={lead.id} className="p-6 hover:bg-warm-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-navy-900 text-lg">{lead.name}</h3>
                    <p className="text-sm text-warm-500">{lead.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="flex gap-6 text-sm text-warm-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {lead.phone}
                  </div>
                </div>

                <p className="text-warm-700 mb-4">{lead.message}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-warm-400">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {lead.status === 'pendente' && (
                    <button
                      onClick={() => handleMarkResolved(lead.id)}
                      className="btn btn-secondary gap-2 text-sm"
                    >
                      <CheckCircle size={16} />
                      Marcar como resolvido
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
