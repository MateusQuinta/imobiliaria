import { useEffect, useState } from 'react'
import React from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle, X, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchAdmins()
  }, [])

  async function fetchAdmins() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setAdmins(data || [])
    } catch (error) {
      toast.error('Erro ao carregar admins')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          status: 'active',
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', id)
      
      if (error) throw error
      toast.success('Admin aprovado com sucesso')
      fetchAdmins()
    } catch (error) {
      toast.error('Erro ao aprovar admin')
      console.error(error)
    }
  }

  async function handleReject(id) {
    if (!confirm('Tem certeza que deseja rejeitar este admin?')) return
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: 'rejected' })
        .eq('id', id)
      
      if (error) throw error
      toast.success('Admin rejeitado')
      fetchAdmins()
    } catch (error) {
      toast.error('Erro ao rejeitar admin')
      console.error(error)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }

  const roleIcons = {
    admin: Shield,
    corretor: User
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Admins</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-warm-500">Carregando...</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-warm-500">Nenhum admin encontrado</div>
        ) : (
          <div className="divide-y divide-warm-200">
            {admins.map(admin => (
              <div key={admin.id} className="p-6 hover:bg-warm-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                      {React.createElement(roleIcons[admin.role] || User, { 
                        size: 24, 
                        className: 'text-navy-600' 
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-lg">{admin.name}</h3>
                      <p className="text-sm text-warm-500">{admin.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[admin.status]}`}>
                    {admin.status}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-warm-600 mb-4">
                  <span className="bg-warm-100 px-2 py-1 rounded">{admin.role}</span>
                  <span>CRECI: {admin.creci || 'Não informado'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-warm-400">
                    Cadastrado em {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  {admin.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(admin.id)}
                        className="btn btn-secondary gap-2 text-sm bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        <CheckCircle size={16} />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(admin.id)}
                        className="btn btn-secondary gap-2 text-sm bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <X size={16} />
                        Rejeitar
                      </button>
                    </div>
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
