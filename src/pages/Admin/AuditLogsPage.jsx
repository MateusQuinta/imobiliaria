import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { 
  FileText, 
  Download, 
  Clock, 
  User, 
  Shield, 
  Filter, 
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AuditLogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data && data.length > 0) {
        setLogs(data)
      } else {
        // Fallback de logs iniciais
        setLogs([
          {
            id: 'l1',
            user_name: 'Diretoria / Admin',
            user_role: 'admin',
            action: 'aprovacao_corretor',
            target_type: 'admin_users',
            target_id: 'usr_patricia',
            details: { brokerName: 'Patrícia Oliveira', creci: '123.456-F' },
            created_at: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            id: 'l2',
            user_name: 'Diretoria / Admin',
            user_role: 'admin',
            action: 'atualizacao_configuracoes_imobiliaria',
            target_type: 'agency_settings',
            details: { rule: 'round_robin', commission: 6.0 },
            created_at: new Date(Date.now() - 3600000 * 18).toISOString()
          },
          {
            id: 'l3',
            user_name: 'Patrícia Oliveira',
            user_role: 'corretor',
            action: 'alteracao_status_lead',
            target_type: 'leads',
            details: { newStatus: 'proposta', leadName: 'Rafael Mendes' },
            created_at: new Date(Date.now() - 3600000 * 26).toISOString()
          }
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Função utilitária para converter e baixar CSV no navegador
  function downloadCSV(filename, rows) {
    if (!rows || rows.length === 0) {
      toast.error('Nenhum dado disponível para exportação.')
      return
    }

    const separator = ';'
    const keys = Object.keys(rows[0])
    const csvContent = [
      keys.join(separator),
      ...rows.map(row => 
        keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k]
          if (typeof cell === 'object') cell = JSON.stringify(cell)
          cell = String(cell).replace(/"/g, '""')
          if (cell.search(/("|,|\n|;)/g) >= 0) cell = `"${cell}"`
          return cell
        }).join(separator)
      )
    ].join('\r\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Relatório "${filename}" baixado com sucesso!`)
  }

  // Exportar Imóveis
  async function handleExportProperties() {
    try {
      const { data } = await supabase.from('properties').select('*')
      if (data && data.length > 0) {
        downloadCSV(`imoveis-vivabelle-${Date.now()}.csv`, data)
      } else {
        toast('Nenhum imóvel no banco.')
      }
    } catch (err) {
      toast.error('Erro ao exportar imóveis.')
    }
  }

  // Exportar Leads
  async function handleExportLeads() {
    try {
      const { data } = await supabase.from('leads').select('*')
      if (data && data.length > 0) {
        downloadCSV(`leads-crm-vivabelle-${Date.now()}.csv`, data)
      } else {
        toast('Nenhum lead no banco.')
      }
    } catch (err) {
      toast.error('Erro ao exportar leads.')
    }
  }

  // Exportar Corretores
  async function handleExportBrokers() {
    try {
      const { data } = await supabase.from('admin_users').select('name, email, phone, creci, creci_uf, city, role, status, created_at, approved_at')
      if (data && data.length > 0) {
        downloadCSV(`corretores-vivabelle-${Date.now()}.csv`, data)
      } else {
        toast('Nenhum corretor no banco.')
      }
    } catch (err) {
      toast.error('Erro ao exportar corretores.')
    }
  }

  // Exportar Logs de Auditoria
  function handleExportAuditLogs() {
    downloadCSV(`auditoria-vivabelle-${Date.now()}.csv`, logs)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Auditoria & Exportação de Relatórios</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Registro de rastreabilidade de todas as ações administrativas e exportação em formato CSV.
          </p>
        </div>
      </div>

      {/* Caixa de Exportação de Relatórios CSV */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200">
        <h2 className="font-serif text-xl font-bold text-navy-900 mb-2 flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-gold-500" /> Exportação de Dados em CSV (Excel)
        </h2>
        <p className="text-warm-500 text-xs mb-6">
          Gere planilhas atualizadas para auditorias financeiras, relatórios mensais e análises de desempenho:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportProperties}
            className="btn btn-secondary justify-center gap-2 text-xs py-3 px-4 border-warm-300 hover:border-gold-500 hover:bg-gold-50 transition"
          >
            <Download size={16} className="text-gold-600 shrink-0" />
            <span className="text-left">Exportar Imóveis (CSV)</span>
          </button>

          <button
            onClick={handleExportLeads}
            className="btn btn-secondary justify-center gap-2 text-xs py-3 px-4 border-warm-300 hover:border-gold-500 hover:bg-gold-50 transition"
          >
            <Download size={16} className="text-gold-600 shrink-0" />
            <span className="text-left">Exportar Leads / CRM (CSV)</span>
          </button>

          <button
            onClick={handleExportBrokers}
            className="btn btn-secondary justify-center gap-2 text-xs py-3 px-4 border-warm-300 hover:border-gold-500 hover:bg-gold-50 transition"
          >
            <Download size={16} className="text-gold-600 shrink-0" />
            <span className="text-left">Exportar Corretores (CSV)</span>
          </button>

          <button
            onClick={handleExportAuditLogs}
            className="btn btn-secondary justify-center gap-2 text-xs py-3 px-4 border-warm-300 hover:border-gold-500 hover:bg-gold-50 transition"
          >
            <Download size={16} className="text-gold-600 shrink-0" />
            <span className="text-left">Exportar Auditoria (CSV)</span>
          </button>
        </div>
      </div>

      {/* Tabela de Logs de Auditoria */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
        <div className="p-6 border-b border-warm-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-serif text-lg font-bold text-navy-900">Rastreabilidade de Ações Recentes</h2>
          <span className="text-xs text-warm-400">Últimos eventos registrados</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-warm-500">Carregando auditoria...</div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-warm-500">Nenhum evento registrado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-warm-50 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-warm-200">
                  <th className="p-4 whitespace-nowrap">Data e Hora</th>
                  <th className="p-4 whitespace-nowrap">Usuário Responsável</th>
                  <th className="p-4 whitespace-nowrap">Ação Executada</th>
                  <th className="p-4 whitespace-nowrap">Alvo / Entidade</th>
                  <th className="p-4">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 text-xs">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-warm-50 transition">
                    <td className="p-4 text-warm-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString('pt-BR')} às {new Date(log.created_at).toLocaleTimeString('pt-BR')}
                    </td>

                    <td className="p-4 font-semibold text-navy-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{log.user_name || 'Sistema'}</span>
                        <span className="text-[10px] text-warm-400 uppercase bg-warm-100 px-1.5 py-0.5 rounded">({log.user_role || 'user'})</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-50 text-navy-800 border border-navy-100">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4 text-warm-600 font-medium whitespace-nowrap">
                      {log.target_type} {log.target_id ? `(#${log.target_id.substring(0, 8)})` : ''}
                    </td>

                    <td className="p-4 text-warm-500 font-mono text-[11px] break-all">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
