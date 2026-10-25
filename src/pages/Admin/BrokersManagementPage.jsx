import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { logAuditEvent } from '../../lib/api'
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  UserX, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  Phone,
  Mail,
  ExternalLink,
  Ban
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function BrokersManagementPage() {
  const { user, profile } = useAuth()
  const [brokers, setBrokers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modal de suspensão
  const [selectedBroker, setSelectedBroker] = useState(null)
  const [suspendModalOpen, setSuspendModalOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')

  useEffect(() => {
    fetchBrokers()
  }, [])

  async function fetchBrokers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBrokers(data || [])
    } catch (err) {
      toast.error('Erro ao carregar lista de corretores.')
    } finally {
      setLoading(false)
    }
  }

  // Suspender Corretor
  async function handleConfirmSuspend(e) {
    e.preventDefault()
    if (!suspendReason.trim()) {
      toast.error('Informe o motivo da suspensão.')
      return
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          status: 'suspended',
          rejection_reason: suspendReason.trim(),
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', selectedBroker.id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'suspensao_corretor',
        targetType: 'admin_users',
        targetId: selectedBroker.id,
        details: { brokerName: selectedBroker.name, reason: suspendReason.trim() }
      })

      toast.success(`Acesso do corretor ${selectedBroker.name} suspenso imediatamente.`)
      setSuspendModalOpen(false)
      setSuspendReason('')
      setSelectedBroker(null)
      fetchBrokers()
    } catch (err) {
      toast.error('Erro ao suspender corretor.')
    }
  }

  // Reativar Corretor
  async function handleReactivate(broker) {
    if (!confirm(`Deseja reativar o acesso de ${broker.name}?`)) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          status: 'active',
          rejection_reason: null,
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', broker.id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'reativacao_corretor',
        targetType: 'admin_users',
        targetId: broker.id,
        details: { brokerName: broker.name }
      })

      toast.success(`Corretor ${broker.name} reativado com sucesso!`)
      fetchBrokers()
    } catch (err) {
      toast.error('Erro ao reativar corretor.')
    }
  }

  // Promover Corretor a Administrador (apenas dono/admin pode)
  async function handleToggleAdminRole(broker) {
    const newRole = broker.role === 'admin' ? 'corretor' : 'admin'
    const confirmMsg = newRole === 'admin'
      ? `Promover ${broker.name} a Administrador da imobiliária? Ele terá acesso total às aprovações e relatórios.`
      : `Remover privilégios de administrador de ${broker.name}?`

    if (!confirm(confirmMsg)) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ role: newRole })
        .eq('id', broker.id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'alteracao_papel_usuario',
        targetType: 'admin_users',
        targetId: broker.id,
        details: { brokerName: broker.name, newRole }
      })

      toast.success(`Papel de ${broker.name} alterado para "${newRole}".`)
      fetchBrokers()
    } catch (err) {
      toast.error('Erro ao atualizar papel.')
    }
  }

  const filteredBrokers = brokers.filter(b => {
    const matchesSearch = 
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.creci?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Gestão da Equipe & Corretores</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Controle de acessos, status cadastrais, suspensões e atribuições de permissão.
          </p>
        </div>

        <div className="text-xs text-warm-500 bg-white px-4 py-2 rounded-xl border border-warm-200">
          Total: <strong>{brokers.length}</strong> profissionais cadastrados
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CRECI..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 text-xs py-2 bg-warm-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-warm-500 font-medium">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field text-xs py-2 bg-warm-50"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="pending">Pendentes</option>
            <option value="suspended">Suspensos</option>
            <option value="rejected">Rejeitados</option>
          </select>
        </div>
      </div>

      {/* Tabela de Corretores */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-warm-500">Carregando corretores...</div>
        ) : filteredBrokers.length === 0 ? (
          <div className="p-16 text-center text-warm-500">Nenhum corretor encontrado com os filtros aplicados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-warm-50 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-warm-200">
                  <th className="p-4">Profissional</th>
                  <th className="p-4">CRECI / Região</th>
                  <th className="p-4">Papel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações da Diretoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 text-xs">
                {filteredBrokers.map(broker => {
                  const isCurrentAdmin = broker.id === user?.id
                  return (
                    <tr key={broker.id} className="hover:bg-warm-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'}
                            alt={broker.name}
                            className="w-10 h-10 rounded-xl object-cover border shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-navy-900 text-sm">{broker.name}</p>
                            <p className="text-[11px] text-warm-500">{broker.email}</p>
                            {broker.phone && <p className="text-[11px] text-warm-400">{broker.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-navy-900">CRECI-{broker.creci_uf || 'SP'} {broker.creci || 'Pendente'}</span>
                        <p className="text-[11px] text-warm-500 mt-0.5">{broker.city || 'São José dos Campos'}</p>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          broker.role === 'admin' ? 'bg-gold-100 text-gold-900' : 'bg-warm-100 text-warm-800'
                        }`}>
                          {broker.role === 'admin' ? <Shield size={12} /> : null}
                          {broker.role === 'admin' ? 'Administrador' : 'Corretor'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          broker.status === 'active' || broker.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          broker.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          broker.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {broker.status === 'active' ? 'Ativo' : broker.status === 'suspended' ? 'Suspenso' : broker.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* Botão de Suspensão / Reativação */}
                          {broker.status === 'active' && !isCurrentAdmin && (
                            <button
                              onClick={() => {
                                setSelectedBroker(broker)
                                setSuspendModalOpen(true)
                              }}
                              className="btn btn-secondary text-[11px] py-1 px-2.5 text-red-700 bg-red-50 hover:bg-red-100 border-red-200"
                              title="Suspender acesso imediatamente"
                            >
                              Suspender
                            </button>
                          )}

                          {broker.status === 'suspended' && (
                            <button
                              onClick={() => handleReactivate(broker)}
                              className="btn btn-secondary text-[11px] py-1 px-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                            >
                              Reativar
                            </button>
                          )}

                          {/* Alternar privilégio de Admin (só para outros usuários) */}
                          {!isCurrentAdmin && (
                            <button
                              onClick={() => handleToggleAdminRole(broker)}
                              className="text-[11px] font-semibold text-warm-600 hover:text-gold-600 underline px-1"
                              title={broker.role === 'admin' ? 'Tornar Corretor Comum' : 'Promover a Administrador'}
                            >
                              {broker.role === 'admin' ? 'Rebaixar' : 'Promover'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Suspensão */}
      {suspendModalOpen && selectedBroker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-warm-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <Ban size={24} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">
              Suspender Corretor
            </h3>
            <p className="text-warm-600 text-xs leading-relaxed mb-6">
              A suspensão de <strong>{selectedBroker.name}</strong> cortará o acesso imediatamente (derrubando sessões ativas). Informe o motivo para registro em auditoria:
            </p>

            <form onSubmit={handleConfirmSuspend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Motivo da Suspensão *
                </label>
                <textarea
                  rows={4}
                  required
                  value={suspendReason}
                  onChange={e => setSuspendReason(e.target.value)}
                  placeholder="Ex: Descumprimento das normas éticas da imobiliária ou pendência documental junto ao CRECI..."
                  className="input-field text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuspendModalOpen(false)
                    setSuspendReason('')
                  }}
                  className="btn btn-secondary flex-1 justify-center text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 justify-center text-xs py-2.5 bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar Suspensão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
