import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { logAuditEvent } from '../../lib/api'
import { 
  Kanban as KanbanIcon, 
  List, 
  Phone, 
  Mail, 
  MessageCircle, 
  Plus, 
  Clock, 
  Building2, 
  AlertTriangle, 
  X, 
  UserCheck, 
  Check, 
  Calendar,
  ChevronRight,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

const KANBAN_COLUMNS = [
  { id: 'novo', title: 'Novo', color: 'border-blue-500 bg-blue-50 text-blue-900' },
  { id: 'em_contato', title: 'Em Contato', color: 'border-amber-500 bg-amber-50 text-amber-900' },
  { id: 'visita_agendada', title: 'Visita Agendada', color: 'border-purple-500 bg-purple-50 text-purple-900' },
  { id: 'proposta', title: 'Proposta', color: 'border-indigo-500 bg-indigo-50 text-indigo-900' },
  { id: 'fechado', title: 'Fechado / Ganho', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
  { id: 'perdido', title: 'Perdido', color: 'border-red-500 bg-red-50 text-red-900' },
]

export default function LeadsPage() {
  const { user, profile, isAdmin } = useAuth()
  const [leads, setLeads] = useState([])
  const [brokers, setBrokers] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list'

  // Modais de ação
  const [selectedLead, setSelectedLead] = useState(null)
  const [lossModalOpen, setLossModalOpen] = useState(false)
  const [lossReason, setLossReason] = useState('')
  const [targetStatusChange, setTargetStatusChange] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [reassignBrokerId, setReassignBrokerId] = useState('')

  useEffect(() => {
    fetchLeadsAndBrokers()
  }, [user, isAdmin])

  async function fetchLeadsAndBrokers() {
    setLoading(true)
    try {
      // 1. Buscar corretores ativos para opção de reatribuição (se admin)
      if (isAdmin) {
        const { data: brokersData } = await supabase
          .from('admin_users')
          .select('id, name, email, creci')
          .eq('status', 'active')
        setBrokers(brokersData || [])
      }

      // 2. Buscar leads
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
      
      // Se não for admin, busca apenas os leads atribuídos ao corretor ou não atribuídos
      if (!isAdmin && user?.id) {
        query = query.or(`broker_id.eq.${user.id},broker_id.is.null`)
      }

      const { data, error } = await query

      if (error) {
        // Fallback: se a tabela nova não tiver dados, busca de contact_forms
        const { data: contactsData } = await supabase.from('contact_forms').select('*')
        if (contactsData) {
          const mapped = contactsData.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            subject: c.subject,
            message: c.message,
            status: c.status === 'resolvido' ? 'fechado' : 'novo',
            created_at: c.created_at,
            history: []
          }))
          setLeads(mapped)
          return
        }
        throw error
      }

      setLeads(data || [])
    } catch (err) {
      console.error('Error fetching leads:', err)
      toast.error('Erro ao carregar leads.')
    } finally {
      setLoading(false)
    }
  }

  // Mover status do Lead
  async function handleStatusChange(lead, newStatus) {
    if (newStatus === 'perdido') {
      // Abre modal obrigatório de motivo de perda
      setSelectedLead(lead)
      setTargetStatusChange('perdido')
      setLossModalOpen(true)
      return
    }

    await applyStatusUpdate(lead.id, newStatus)
  }

  async function applyStatusUpdate(leadId, newStatus, reason = null) {
    try {
      const currentLead = leads.find(l => l.id === leadId)
      const newHistoryEntry = {
        date: new Date().toISOString(),
        status: newStatus,
        by: profile?.name || 'Corretor',
        note: reason ? `Motivo de perda: ${reason}` : `Alterado para ${newStatus}`
      }

      const updatedHistory = [...(currentLead?.history || []), newHistoryEntry]

      const { error } = await supabase
        .from('leads')
        .update({
          status: newStatus,
          loss_reason: reason,
          history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)

      if (error) throw error

      toast.success(`Lead movido para "${KANBAN_COLUMNS.find(c => c.id === newStatus)?.title}"`)
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, loss_reason: reason, history: updatedHistory } : l))

      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => ({ ...prev, status: newStatus, loss_reason: reason, history: updatedHistory }))
      }

      // Auditoria
      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: profile?.role,
        action: 'alteracao_status_lead',
        targetType: 'leads',
        targetId: leadId,
        details: { newStatus, reason }
      })
    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar status do lead.')
    }
  }

  // Confirmar motivo de perda
  const handleConfirmLoss = async (e) => {
    e.preventDefault()
    if (!lossReason.trim()) {
      toast.error('Informe o motivo da perda do lead.')
      return
    }

    await applyStatusUpdate(selectedLead.id, 'perdido', lossReason)
    setLossModalOpen(false)
    setLossReason('')
  }

  // Adicionar anotação interna no lead
  const handleAddNote = async (leadId) => {
    if (!newNote.trim()) return
    try {
      const currentLead = leads.find(l => l.id === leadId)
      const newHistoryEntry = {
        date: new Date().toISOString(),
        by: profile?.name || 'Corretor',
        note: newNote.trim()
      }
      const updatedHistory = [...(currentLead?.history || []), newHistoryEntry]

      await supabase
        .from('leads')
        .update({ history: updatedHistory })
        .eq('id', leadId)

      toast.success('Anotação registrada com sucesso!')
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, history: updatedHistory } : l))
      setSelectedLead(prev => ({ ...prev, history: updatedHistory }))
      setNewNote('')
    } catch (err) {
      toast.error('Erro ao salvar anotação.')
    }
  }

  // Reatribuir lead para outro corretor (Admin)
  const handleReassign = async (leadId, brokerId) => {
    try {
      const targetBroker = brokers.find(b => b.id === brokerId)
      await supabase
        .from('leads')
        .update({ broker_id: brokerId })
        .eq('id', leadId)

      toast.success(`Lead reatribuído para ${targetBroker?.name || 'novo corretor'}`)
      fetchLeadsAndBrokers()
    } catch (err) {
      toast.error('Erro ao reatribuir lead.')
    }
  }

  // Gerar link formatado do WhatsApp com mensagem inicial
  const getWhatsAppLink = (lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '')
    const brokerName = profile?.name || 'Viva Belle Imobiliária'
    const propertyRef = lead.property_title ? ` a respeito do imóvel "${lead.property_title}"` : ''
    const msg = `Olá, ${lead.name}! Sou ${brokerName}, consultor da Viva Belle Imobiliária. Vi seu contato${propertyRef} e estou à disposição para lhe atender. Como posso te ajudar hoje?`
    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Funil de Leads (CRM)</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Gerencie o ciclo de atendimento, propostas e conversão dos clientes interessados nos imóveis.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-warm-200 shadow-sm">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'kanban' ? 'bg-gold-500 text-white shadow-sm' : 'text-warm-600 hover:text-navy-900'
            }`}
          >
            <KanbanIcon size={14} /> Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'list' ? 'bg-gold-500 text-white shadow-sm' : 'text-warm-600 hover:text-navy-900'
            }`}
          >
            <List size={14} /> Lista
          </button>
        </div>
      </div>

      {/* Conteúdo Principal: Visualização Kanban */}
      {loading ? (
        <div className="p-16 text-center text-warm-500 bg-white rounded-2xl border border-warm-200">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Carregando funil de oportunidades...
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(col => {
            const columnLeads = leads.filter(l => (l.status || 'novo') === col.id)
            return (
              <div key={col.id} className="bg-warm-100/70 rounded-2xl p-3 border border-warm-200 flex flex-col min-w-[260px] max-h-[80vh] flex-1">
                {/* Header da Coluna */}
                <div className="flex justify-between items-center mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'fechado' ? 'bg-emerald-500' : col.id === 'perdido' ? 'bg-red-500' : 'bg-gold-500'}`} />
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-navy-900">
                      {col.title}
                    </h3>
                  </div>
                  <span className="bg-white text-navy-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-warm-200">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards da Coluna */}
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {columnLeads.length === 0 ? (
                    <div className="p-4 text-center text-xs text-warm-400 italic bg-white/50 rounded-xl border border-dashed border-warm-200">
                      Nenhum lead
                    </div>
                  ) : (
                    columnLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-warm-200 hover:shadow-md hover:border-gold-300 transition cursor-pointer space-y-3 group"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm text-navy-900 group-hover:text-gold-600 transition truncate">
                            {lead.name}
                          </h4>
                          <span className="text-[10px] text-warm-400">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>

                        {lead.property_title && (
                          <div className="flex items-center gap-1.5 text-xs text-warm-600 bg-warm-50 p-1.5 rounded-lg">
                            <Building2 size={13} className="text-gold-500 shrink-0" />
                            <span className="truncate">{lead.property_title}</span>
                          </div>
                        )}

                        <p className="text-xs text-warm-500 line-clamp-2">
                          {lead.message || lead.subject || 'Interessado em agendar visita.'}
                        </p>

                        {/* Botões de Ação Rápida */}
                        <div className="pt-2 border-t border-warm-100 flex items-center justify-between">
                          <a
                            href={getWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </a>

                          <select
                            value={lead.status || 'novo'}
                            onChange={e => {
                              e.stopPropagation()
                              handleStatusChange(lead, e.target.value)
                            }}
                            onClick={e => e.stopPropagation()}
                            className="text-[10px] font-semibold bg-warm-50 border border-warm-200 rounded-lg px-2 py-1 outline-none text-navy-900 cursor-pointer"
                          >
                            {KANBAN_COLUMNS.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Visualização em Lista */
        <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
          <div className="divide-y divide-warm-200">
            {leads.map(lead => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="p-5 hover:bg-warm-50 transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-navy-900 text-base">{lead.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'fechado' ? 'bg-emerald-100 text-emerald-800' :
                      lead.status === 'perdido' ? 'bg-red-100 text-red-800' :
                      'bg-gold-100 text-gold-800'
                    }`}>
                      {KANBAN_COLUMNS.find(c => c.id === lead.status)?.title || lead.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-warm-500 mt-1.5">
                    <span className="flex items-center gap-1"><Phone size={13} /> {lead.phone}</span>
                    {lead.email && <span className="flex items-center gap-1"><Mail size={13} /> {lead.email}</span>}
                    {lead.property_title && (
                      <span className="flex items-center gap-1 font-medium text-navy-800">
                        <Building2 size={13} /> {lead.property_title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={e => e.stopPropagation()}>
                  <a
                    href={getWhatsAppLink(lead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200 py-2"
                  >
                    <MessageCircle size={14} className="text-emerald-600" /> WhatsApp
                  </a>

                  <select
                    value={lead.status || 'novo'}
                    onChange={e => handleStatusChange(lead, e.target.value)}
                    className="input-field text-xs py-2 bg-white"
                  >
                    {KANBAN_COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer / Modal de Detalhes do Lead */}
      {selectedLead && !lossModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-warm-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                    Ficha do Lead & Histórico
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 mt-0.5">
                    {selectedLead.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg hover:bg-warm-100 text-warm-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contatos */}
              <div className="space-y-2 text-sm bg-warm-50 p-4 rounded-xl border border-warm-200">
                <div className="flex items-center justify-between">
                  <span className="text-warm-500 text-xs">Telefone / WhatsApp:</span>
                  <a href={getWhatsAppLink(selectedLead)} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                    <MessageCircle size={14} /> {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-warm-500 text-xs">E-mail:</span>
                    <span className="font-semibold text-navy-900">{selectedLead.email}</span>
                  </div>
                )}
                {selectedLead.property_title && (
                  <div className="flex items-center justify-between pt-2 border-t border-warm-200">
                    <span className="text-warm-500 text-xs">Imóvel de Interesse:</span>
                    <span className="font-semibold text-navy-900 text-right">{selectedLead.property_title}</span>
                  </div>
                )}
              </div>

              {/* Mensagem Inicial */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">Mensagem do Cliente</h4>
                <div className="bg-warm-100/50 p-3.5 rounded-xl text-xs text-warm-700 leading-relaxed border border-warm-200">
                  {selectedLead.message || selectedLead.subject || 'Sem mensagem adicional enviada.'}
                </div>
              </div>

              {/* Reatribuição para Admin */}
              {isAdmin && brokers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">Corretor Responsável</h4>
                  <select
                    value={selectedLead.broker_id || ''}
                    onChange={e => handleReassign(selectedLead.id, e.target.value)}
                    className="input-field text-xs bg-white"
                  >
                    <option value="">Não atribuído (Disponível)</option>
                    {brokers.map(b => (
                      <option key={b.id} value={b.id}>{b.name} (CRECI {b.creci})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Histórico e Linha do Tempo */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3 flex items-center gap-1.5">
                  <Clock size={14} className="text-gold-500" /> Histórico de Interações
                </h4>
                <div className="space-y-3">
                  {(selectedLead.history || []).map((entry, idx) => (
                    <div key={idx} className="bg-warm-50 p-3 rounded-xl border border-warm-200 text-xs">
                      <div className="flex justify-between items-center text-warm-400 mb-1">
                        <span className="font-semibold text-navy-800">{entry.by || 'Sistema'}</span>
                        <span>{new Date(entry.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <p className="text-warm-700">{entry.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adicionar Anotação */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
                  Adicionar Nova Anotação
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Ex: Cliente prefere visitas no sábado de manhã..."
                    className="input-field text-xs"
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedLead.id)}
                  />
                  <button
                    onClick={() => handleAddNote(selectedLead.id)}
                    className="btn btn-primary text-xs py-2 px-4 shrink-0"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-warm-200 flex gap-3">
              <a
                href={getWhatsAppLink(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <MessageCircle size={16} /> Iniciar Conversa no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Obrigatório: Motivo de Perda do Lead */}
      {lossModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-warm-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">
              Motivo da Perda do Lead
            </h3>
            <p className="text-warm-600 text-xs leading-relaxed mb-6">
              Para qualificação de mercado e estatísticas de vendas, informe o motivo pelo qual a negociação com <strong>{selectedLead.name}</strong> não prosperou:
            </p>

            <form onSubmit={handleConfirmLoss} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Selecione ou descreva o motivo *
                </label>
                <select
                  value={lossReason}
                  onChange={e => setLossReason(e.target.value)}
                  className="input-field mb-2 text-xs"
                >
                  <option value="">Selecione um motivo...</option>
                  <option value="Comprou imóvel com outra imobiliária">Comprou imóvel com outra imobiliária</option>
                  <option value="Preço acima da capacidade financeira / Sem aprovação de crédito">Preço acima da capacidade financeira / Sem aprovação de crédito</option>
                  <option value="Desistiu da compra no momento">Desistiu da compra no momento</option>
                  <option value="Não respondeu às tentativas de contato">Não respondeu às tentativas de contato</option>
                  <option value="Procurando imóvel em outra cidade fora do Vale">Procurando imóvel em outra cidade fora do Vale</option>
                  <option value="Imóvel não atendia especificações (vagas/área/lazer)">Imóvel não atendia especificações</option>
                </select>

                <textarea
                  rows={3}
                  value={lossReason}
                  onChange={e => setLossReason(e.target.value)}
                  placeholder="Ou detalhe outro motivo com suas próprias palavras..."
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLossModalOpen(false)
                    setLossReason('')
                  }}
                  className="btn btn-secondary flex-1 justify-center text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 justify-center text-xs py-2.5 bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar Perda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
