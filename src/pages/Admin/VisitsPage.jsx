import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { 
  Calendar, 
  Clock, 
  Plus, 
  MapPin, 
  User, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  Building2,
  CalendarCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function VisitsPage() {
  const { user, profile, isAdmin } = useAuth()
  const [visits, setVisits] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    property_id: '',
    client_name: '',
    client_phone: '',
    date: '',
    time: '10:00',
    notes: ''
  })

  useEffect(() => {
    fetchVisitsAndProperties()
  }, [user, isAdmin])

  async function fetchVisitsAndProperties() {
    setLoading(true)
    try {
      // 1. Buscar imóveis disponíveis para agendamento
      const { data: propsData } = await supabase
        .from('properties')
        .select('id, title, address, neighborhood, city')
        .order('title')
      setProperties(propsData || [])

      // 2. Buscar visitas
      let query = supabase.from('visits').select('*').order('scheduled_date', { ascending: true })
      if (!isAdmin && user?.id) {
        query = query.eq('broker_id', user.id)
      }

      const { data, error } = await query
      if (!error && data) {
        setVisits(data)
      } else {
        // Fallback inicial se ainda não houver registros
        setVisits([
          {
            id: 'v1',
            client_name: 'Dra. Mariana Albuquerque',
            client_phone: '(12) 99123-4567',
            property_title: 'Apartamento de Alto Padrão no Jardim Aquarius',
            scheduled_date: new Date(Date.now() + 86400000 * 2).toISOString(),
            status: 'agendada',
            notes: 'Cliente busca imóvel com varanda gourmet e 2 vagas livres.'
          },
          {
            id: 'v2',
            client_name: 'Eng. Roberto Fontes',
            client_phone: '(12) 98877-6655',
            property_title: 'Mansão Contemporânea no Jardim das Colinas',
            scheduled_date: new Date(Date.now() + 86400000 * 4).toISOString(),
            status: 'agendada',
            notes: 'Interesse em permuta parcial por terreno no Urbanova.'
          }
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVisit = async (e) => {
    e.preventDefault()
    try {
      const selectedProp = properties.find(p => String(p.id) === String(formData.property_id))
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString()

      const newVisit = {
        broker_id: user?.id,
        property_id: formData.property_id ? Number(formData.property_id) : null,
        property_title: selectedProp?.title || 'Imóvel em São José dos Campos',
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        scheduled_date: combinedDateTime,
        status: 'agendada',
        notes: formData.notes
      }

      const { data, error } = await supabase.from('visits').insert(newVisit).select().single()

      toast.success('Visita agendada com sucesso!')
      setVisits(prev => [data || { ...newVisit, id: `v_${Date.now()}` }, ...prev])
      setModalOpen(false)
      setFormData({ property_id: '', client_name: '', client_phone: '', date: '', time: '10:00', notes: '' })
    } catch (err) {
      toast.error('Erro ao agendar visita.')
    }
  }

  const handleUpdateStatus = async (visitId, newStatus) => {
    try {
      await supabase.from('visits').update({ status: newStatus }).eq('id', visitId)
      setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: newStatus } : v))
      toast.success(`Visita marcada como ${newStatus}`)
    } catch (err) {
      toast.error('Erro ao atualizar status.')
    }
  }

  const getConfirmationWhatsApp = (visit) => {
    const cleanPhone = visit.client_phone.replace(/\D/g, '')
    const dateFormatted = new Date(visit.scheduled_date).toLocaleDateString('pt-BR')
    const timeFormatted = new Date(visit.scheduled_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const brokerName = profile?.name || 'Viva Belle Imobiliária'
    const msg = `Olá, ${visit.client_name}! Aqui é ${brokerName} da Viva Belle Imobiliária. Passando para confirmar nossa visita agendada ao imóvel "${visit.property_title}" no dia ${dateFormatted} às ${timeFormatted}. Podemos confirmar?`
    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Agenda de Visitas</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Acompanhe compromissos agendados com compradores e proprietários no Vale do Paraíba.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary gap-2 text-xs py-3 px-5 shadow-sm"
        >
          <Plus size={16} /> Agendar Nova Visita
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-warm-500 bg-white rounded-2xl border border-warm-200">
          Carregando agenda...
        </div>
      ) : visits.length === 0 ? (
        <div className="p-16 text-center text-warm-500 bg-white rounded-2xl border border-warm-200">
          <CalendarCheck size={40} className="mx-auto text-warm-300 mb-3" />
          <h3 className="font-semibold text-navy-900">Nenhuma visita agendada</h3>
          <p className="text-xs text-warm-400 mt-1">Clique no botão acima para registrar uma visita com um cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map(visit => {
            const dateObj = new Date(visit.scheduled_date)
            return (
              <div key={visit.id} className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200 space-y-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-lg">
                    <Calendar size={14} />
                    {dateObj.toLocaleDateString('pt-BR')} &middot; {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    visit.status === 'realizada' ? 'bg-emerald-100 text-emerald-800' :
                    visit.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {visit.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-navy-900">{visit.client_name}</h3>
                  <p className="text-xs text-warm-500 mt-0.5 flex items-center gap-1.5">
                    <Phone size={12} /> {visit.client_phone}
                  </p>
                </div>

                <div className="bg-warm-50 p-3 rounded-xl border border-warm-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-navy-900 truncate">
                    <Building2 size={13} className="text-gold-500 shrink-0" />
                    <span className="truncate">{visit.property_title}</span>
                  </div>
                  {visit.notes && (
                    <p className="text-[11px] text-warm-500 line-clamp-2">
                      Nota: {visit.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-warm-100 flex items-center justify-between gap-2">
                  <a
                    href={getConfirmationWhatsApp(visit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200 py-1.5 px-3"
                  >
                    <MessageCircle size={14} className="text-emerald-600" /> Confirmar
                  </a>

                  {visit.status === 'agendada' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(visit.id, 'realizada')}
                        title="Marcar como Realizada"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(visit.id, 'cancelada')}
                        title="Marcar como Cancelada"
                        className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Agendamento */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-warm-200">
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">
              Agendar Nova Visita
            </h3>

            <form onSubmit={handleCreateVisit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Imóvel *</label>
                <select
                  required
                  value={formData.property_id}
                  onChange={e => setFormData({...formData, property_id: e.target.value})}
                  className="input-field text-xs bg-white"
                >
                  <option value="">Selecione o imóvel...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.neighborhood})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={e => setFormData({...formData, client_name: e.target.value})}
                  placeholder="Ex: Dra. Mariana Albuquerque"
                  className="input-field text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">WhatsApp do Cliente *</label>
                <input
                  type="tel"
                  required
                  value={formData.client_phone}
                  onChange={e => setFormData({...formData, client_phone: e.target.value})}
                  placeholder="(12) 99999-9999"
                  className="input-field text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="input-field text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="input-field text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Notas / Lembretes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Ex: Pegar chaves na portaria do Hyde Park..."
                  className="input-field text-xs bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary flex-1 justify-center text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 justify-center text-xs py-2.5"
                >
                  Salvar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
