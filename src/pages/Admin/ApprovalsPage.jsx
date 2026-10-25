import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { logAuditEvent } from '../../lib/api'
import { 
  UserCheck, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Clock, 
  ShieldAlert, 
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ApprovalsPage() {
  const { user, profile } = useAuth()
  const [pendingBrokers, setPendingBrokers] = useState([])
  const [loading, setLoading] = useState(true)

  // Modais de ação
  const [selectedBroker, setSelectedBroker] = useState(null)
  const [previewDocUrl, setPreviewDocUrl] = useState(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false)
  const [actionReason, setActionReason] = useState('')

  useEffect(() => {
    fetchPendingBrokers()
  }, [])

  async function fetchPendingBrokers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingBrokers(data || [])
    } catch (err) {
      console.error(err)
      toast.error('Erro ao carregar fila de aprovação.')
    } finally {
      setLoading(false)
    }
  }

  // 1. Aprovar Corretor
  async function handleApprove(broker) {
    if (!confirm(`Deseja confirmar a aprovação do corretor ${broker.name}? O acesso ao painel será liberado imediatamente.`)) return

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          status: 'active',
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', broker.id)

      if (error) throw error

      // Registrar auditoria
      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'aprovacao_corretor',
        targetType: 'admin_users',
        targetId: broker.id,
        details: { brokerName: broker.name, creci: broker.creci }
      })

      toast.success(`Corretor ${broker.name} aprovado com sucesso!`)
      fetchPendingBrokers()
    } catch (err) {
      toast.error('Erro ao aprovar corretor.')
    }
  }

  // 2. Rejeitar Corretor (com motivo obrigatório)
  async function handleConfirmReject(e) {
    e.preventDefault()
    if (!actionReason.trim()) {
      toast.error('O motivo da rejeição é obrigatório.')
      return
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          status: 'rejected',
          rejection_reason: actionReason.trim(),
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', selectedBroker.id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'rejeicao_corretor',
        targetType: 'admin_users',
        targetId: selectedBroker.id,
        details: { reason: actionReason.trim(), brokerName: selectedBroker.name }
      })

      toast.success('Cadastro rejeitado com justificativa gravada.')
      setRejectModalOpen(false)
      setActionReason('')
      setSelectedBroker(null)
      fetchPendingBrokers()
    } catch (err) {
      toast.error('Erro ao rejeitar corretor.')
    }
  }

  // 3. Solicitar Correção de Dados
  async function handleConfirmCorrection(e) {
    e.preventDefault()
    if (!actionReason.trim()) {
      toast.error('Descreva as correções necessárias.')
      return
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          correction_request: actionReason.trim(),
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', selectedBroker.id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'solicitacao_correcao_dados_corretor',
        targetType: 'admin_users',
        targetId: selectedBroker.id,
        details: { request: actionReason.trim(), brokerName: selectedBroker.name }
      })

      toast.success('Solicitação de correção enviada ao corretor.')
      setCorrectionModalOpen(false)
      setActionReason('')
      setSelectedBroker(null)
      fetchPendingBrokers()
    } catch (err) {
      toast.error('Erro ao solicitar correção.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-900">Fila de Aprovação de Corretores</h1>
        <p className="text-warm-500 text-sm mt-0.5">
          Valide a regularidade jurídica no CRECI antes de liberar credenciais de anunciante.
        </p>
      </div>

      {/* Lembrete Institucional de Validação no CRECI */}
      <div className="bg-navy-50 border border-navy-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-navy-900 text-sm">
              Procedimento Obrigatório de Verificação Cadastral (CRECI-SP)
            </h3>
            <p className="text-xs text-navy-700 leading-relaxed max-w-2xl mt-0.5">
              Por determinação legal e conformidade da Viva Belle Imobiliária, confira sempre a situação da inscrição do profissional no portal oficial do CRECI antes de deferir o acesso.
            </p>
          </div>
        </div>

        <a
          href="https://www.crecisp.gov.br/cidadao/buscaporcorretores"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary text-xs gap-1.5 bg-white border-navy-300 text-navy-900 hover:bg-navy-900 hover:text-white shrink-0 py-2.5 px-4"
        >
          Consultar no CRECI-SP <ExternalLink size={14} />
        </a>
      </div>

      {/* Fila de Cadastros */}
      {loading ? (
        <div className="p-16 text-center text-warm-500 bg-white rounded-2xl border border-warm-200">
          Carregando fila de solicitações...
        </div>
      ) : pendingBrokers.length === 0 ? (
        <div className="p-16 text-center text-warm-500 bg-white rounded-2xl border border-warm-200">
          <CheckCircle2 size={44} className="mx-auto text-emerald-500 mb-3" />
          <h3 className="font-semibold text-navy-900 text-base">Fila limpa! Nenhuma aprovação pendente.</h3>
          <p className="text-xs text-warm-400 mt-1">Todos os corretores cadastrados já foram revisados pela diretoria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingBrokers.map(broker => (
            <div
              key={broker.id}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-warm-100">
                <div className="flex items-center gap-4">
                  <img
                    src={broker.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80'}
                    alt={broker.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-warm-300 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-navy-900">{broker.name}</h3>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Aguardando Aprovação
                      </span>
                    </div>
                    <p className="text-xs text-warm-500 mt-0.5">
                      Submetido em: {new Date(broker.created_at).toLocaleDateString('pt-BR')} às {new Date(broker.created_at).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Ações da Diretoria */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(broker)}
                    className="btn btn-primary gap-1.5 text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none justify-center"
                  >
                    <Check size={16} /> Aprovar Corretor
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBroker(broker)
                      setCorrectionModalOpen(true)
                    }}
                    className="btn btn-secondary gap-1.5 text-xs py-2 px-4 bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 flex-1 sm:flex-none justify-center"
                  >
                    Solicitar Correção
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBroker(broker)
                      setRejectModalOpen(true)
                    }}
                    className="btn btn-secondary gap-1.5 text-xs py-2 px-4 bg-red-50 text-red-700 hover:bg-red-100 border-red-200 flex-1 sm:flex-none justify-center"
                  >
                    <X size={16} /> Rejeitar
                  </button>
                </div>
              </div>

              {/* Grid de Informações do Profissional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-100">
                  <span className="text-warm-500 block">CRECI & Situação:</span>
                  <strong className="text-navy-900 text-sm">
                    {broker.creci || 'Não informado'} &middot; {broker.creci_uf || 'SP'} ({broker.creci_type || 'definitivo'})
                  </strong>
                </div>

                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-100">
                  <span className="text-warm-500 block">CPF Cadastrado:</span>
                  <strong className="text-navy-900 text-sm">{broker.cpf || 'Não informado'}</strong>
                </div>

                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-100">
                  <span className="text-warm-500 block">Telefone / WhatsApp:</span>
                  <strong className="text-navy-900 text-sm">{broker.phone || 'Não informado'}</strong>
                </div>

                <div className="bg-warm-50 p-3.5 rounded-xl border border-warm-100">
                  <span className="text-warm-500 block">Cidade Principal:</span>
                  <strong className="text-navy-900 text-sm">{broker.city || 'São José dos Campos'}</strong>
                </div>
              </div>

              {/* Visualização de Documentos Anexados */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3 flex items-center gap-1.5">
                  <FileText size={14} className="text-gold-500" /> Documentos Comprobatórios do CRECI
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-navy-900">Cópia do CRECI (Frente)</p>
                      <p className="text-[11px] text-warm-500">Documento de identificação profissional</p>
                    </div>
                    {broker.creci_card_front ? (
                      <button
                        onClick={() => setPreviewDocUrl(broker.creci_card_front)}
                        className="btn btn-secondary text-xs gap-1.5 py-1.5 px-3 bg-white"
                      >
                        <Eye size={13} /> Visualizar
                      </button>
                    ) : (
                      <span className="text-[11px] text-warm-400 italic">Não anexado</span>
                    )}
                  </div>

                  <div className="p-4 bg-warm-50 rounded-xl border border-warm-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-navy-900">Cópia do CRECI (Verso)</p>
                      <p className="text-[11px] text-warm-500">Comprovante de validade/situação</p>
                    </div>
                    {broker.creci_card_back ? (
                      <button
                        onClick={() => setPreviewDocUrl(broker.creci_card_back)}
                        className="btn btn-secondary text-xs gap-1.5 py-1.5 px-3 bg-white"
                      >
                        <Eye size={13} /> Visualizar
                      </button>
                    ) : (
                      <span className="text-[11px] text-warm-400 italic">Não anexado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Rejeição (Motivo Obrigatório) */}
      {rejectModalOpen && selectedBroker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-warm-200">
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">
              Rejeitar Cadastro de Corretor
            </h3>
            <p className="text-warm-600 text-xs leading-relaxed mb-6">
              Informe a justificativa fundamentada para a rejeição da solicitação de <strong>{selectedBroker.name}</strong>. Esta mensagem será exibida na tela de bloqueio do profissional:
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Motivo Obrigatório *
                </label>
                <textarea
                  rows={4}
                  required
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder="Ex: Registro no CRECI-SP consta como cancelado ou suspenso no portal do órgão..."
                  className="input-field text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectModalOpen(false)
                    setActionReason('')
                  }}
                  className="btn btn-secondary flex-1 justify-center text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 justify-center text-xs py-2.5 bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar Rejeição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Solicitação de Correção */}
      {correctionModalOpen && selectedBroker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-warm-200">
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">
              Solicitar Correção de Dados
            </h3>
            <p className="text-warm-600 text-xs leading-relaxed mb-6">
              Descreva os dados ou documentos que <strong>{selectedBroker.name}</strong> precisa corrigir ou reenviar:
            </p>

            <form onSubmit={handleConfirmCorrection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  Descrição dos Ajustes Necessários *
                </label>
                <textarea
                  rows={4}
                  required
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder="Ex: A foto do verso da carteira do CRECI está ilegível. Por favor, reenvie em boa resolução..."
                  className="input-field text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCorrectionModalOpen(false)
                    setActionReason('')
                  }}
                  className="btn btn-secondary flex-1 justify-center text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 justify-center text-xs py-2.5 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pré-visualização de Documento */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 max-w-2xl w-full shadow-2xl relative">
            <button
              onClick={() => setPreviewDocUrl(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition"
            >
              <X size={18} />
            </button>
            <img src={previewDocUrl} alt="Documento CRECI" className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
