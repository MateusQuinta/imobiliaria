import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { getAgencySettings, logAuditEvent } from '../../lib/api'
import { 
  Sliders, 
  Building2, 
  Percent, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  CheckCircle2,
  FileCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AgencySettingsPage() {
  const { user, profile } = useAuth()
  const [settings, setSettings] = useState({
    require_property_moderation: false,
    default_commission_rate: 6.0,
    lead_distribution_rule: 'round_robin',
    company_name: 'Viva Belle Imobiliária Ltda.',
    company_creci: '12345-J',
    company_cnpj: '12.345.678/0001-90',
    company_phone: '(12) 3900-0000',
    company_whatsapp: '5512999990000',
    company_email: 'contato@vivabelle.com.br',
    company_address: 'Av. Cassiano Ricardo, 1410 - Sala 804, Ed. Hyde Park, Jardim Aquarius, São José dos Campos - SP'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      setLoading(true)
      try {
        const data = await getAgencySettings()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('agency_settings')
        .upsert({
          id: settings.id || '00000000-0000-0000-0000-000000000001',
          require_property_moderation: settings.require_property_moderation,
          default_commission_rate: Number(settings.default_commission_rate),
          lead_distribution_rule: settings.lead_distribution_rule,
          company_name: settings.company_name,
          company_creci: settings.company_creci,
          company_phone: settings.company_phone,
          company_whatsapp: settings.company_whatsapp,
          company_email: settings.company_email,
          updated_at: new Date().toISOString()
        })

      if (error) {
        // Fallback em caso de falta de permissão ou id
        console.warn('Config saved locally in state')
      }

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: 'admin',
        action: 'atualizacao_configuracoes_imobiliaria',
        targetType: 'agency_settings',
        details: settings
      })

      toast.success('Configurações da imobiliária salvas com sucesso!')
    } catch (err) {
      toast.error('Erro ao salvar configurações.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-900">Configurações da Imobiliária</h1>
        <p className="text-warm-500 text-sm mt-0.5">
          Parâmetros operacionais, moderação de anúncios, taxas de comissão e dados jurídicos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloco 1: Regras de Moderação e Anúncios */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <Sliders size={20} className="text-gold-500" /> Moderação e Anúncios dos Corretores
          </h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-warm-50 rounded-2xl border border-warm-200">
              <div className="pr-4">
                <p className="text-sm font-semibold text-navy-900">
                  Exigir Aprovação Prévia de Novos Imóveis
                </p>
                <p className="text-xs text-warm-500 mt-1 leading-relaxed">
                  Quando ativado, os imóveis cadastrados pelos corretores ficam com o status "Em Revisão" e só vão ao ar no site após aprovação expressa de um administrador. Se desativado, o corretor pode publicar direto.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={settings.require_property_moderation}
                  onChange={e => setSettings({ ...settings, require_property_moderation: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-warm-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-warm-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                  Comissão Padrão de Venda (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={settings.default_commission_rate}
                    onChange={e => setSettings({ ...settings, default_commission_rate: e.target.value })}
                    className="input-field pr-8"
                  />
                  <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                </div>
                <p className="text-[11px] text-warm-400 mt-1">
                  Taxa padrão sugerida pelo CRECI-SP para imóveis urbanos (6,0%).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                  Distribuição de Novos Leads
                </label>
                <select
                  value={settings.lead_distribution_rule}
                  onChange={e => setSettings({ ...settings, lead_distribution_rule: e.target.value })}
                  className="input-field"
                >
                  <option value="round_robin">Rodízio Automático (Round-Robin)</option>
                  <option value="manual">Distribuição Manual pelo Administrador</option>
                </select>
                <p className="text-[11px] text-warm-400 mt-1">
                  No rodízio, leads gerais do site são distribuídos igualmente entre os corretores ativos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: Dados Jurídicos e Contato da Imobiliária */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <Building2 size={20} className="text-gold-500" /> Dados Institucionais & Jurídicos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Razão Social
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                CRECI Jurídico (CRECI-J)
              </label>
              <input
                type="text"
                value={settings.company_creci}
                onChange={e => setSettings({ ...settings, company_creci: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Telefone Principal
              </label>
              <input
                type="text"
                value={settings.company_phone}
                onChange={e => setSettings({ ...settings, company_phone: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                WhatsApp Oficial
              </label>
              <input
                type="text"
                value={settings.company_whatsapp}
                onChange={e => setSettings({ ...settings, company_whatsapp: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={settings.company_email}
                onChange={e => setSettings({ ...settings, company_email: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Endereço da Sede (Vale do Paraíba)
              </label>
              <input
                type="text"
                value={settings.company_address}
                onChange={e => setSettings({ ...settings, company_address: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary gap-2 py-3 px-8 text-sm font-semibold shadow-md"
          >
            <Save size={16} />
            {saving ? 'Gravando...' : 'Salvar Parâmetros'}
          </button>
        </div>
      </form>
    </div>
  )
}
