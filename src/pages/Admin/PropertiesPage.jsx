import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { logAuditEvent } from '../../lib/api'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  Search, 
  CheckCircle2, 
  PauseCircle, 
  PlayCircle,
  Award,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function PropertiesPage() {
  const { user, profile, isAdmin } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProperties()
  }, [filter, user, isAdmin])

  async function fetchProperties() {
    setLoading(true)
    try {
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false })
      
      // Se corretor, só vê os próprios imóveis
      if (!isAdmin && user?.id) {
        query = query.eq('created_by', user.id)
      }

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      toast.error('Erro ao carregar imóveis.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Marcar como Vendido
  async function handleMarkSold(id, title) {
    if (!confirm(`Deseja marcar o imóvel "${title}" como VENDIDO?`)) return
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'vendido', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: profile?.role,
        action: 'marcar_imovel_vendido',
        targetType: 'properties',
        targetId: id,
        details: { title }
      })

      toast.success('Imóvel marcado como VENDIDO com sucesso!')
      fetchProperties()
    } catch (err) {
      toast.error('Erro ao atualizar status.')
    }
  }

  // Alternar entre Ativo e Pausado
  async function handleTogglePause(id, currentStatus, title) {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo'
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast.success(newStatus === 'ativo' ? 'Imóvel reativado no site!' : 'Imóvel pausado temporariamente.')
      fetchProperties()
    } catch (err) {
      toast.error('Erro ao alterar status do imóvel.')
    }
  }

  const statusBadges = {
    ativo: 'bg-emerald-100 text-emerald-800',
    rascunho: 'bg-warm-100 text-warm-700',
    inativo: 'bg-amber-100 text-amber-800',
    vendido: 'bg-blue-100 text-blue-800',
    alugado: 'bg-purple-100 text-purple-800',
    em_revisao: 'bg-amber-100 text-amber-900 border border-amber-300'
  }

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            {isAdmin ? 'Todos os Imóveis Cadastrados' : 'Meus Imóveis'}
          </h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Gerencie o portfólio de imóveis, altere preços, pause anúncios ou marque como negociados.
          </p>
        </div>

        <Link to="/admin/properties/new" className="btn btn-primary gap-2 text-xs py-3 px-5 shadow-sm">
          <Plus size={16} /> Cadastrar Novo Imóvel
        </Link>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            placeholder="Buscar por título, bairro ou cidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 text-xs py-2 bg-warm-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-warm-500 font-medium">Status:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-field text-xs py-2 bg-warm-50"
          >
            <option value="all">Todos os status</option>
            <option value="ativo">Ativo (No site)</option>
            <option value="rascunho">Rascunho</option>
            <option value="inativo">Pausado / Inativo</option>
            <option value="vendido">Vendido</option>
            <option value="alugado">Alugado</option>
          </select>
        </div>
      </div>

      {/* Grid / Tabela de Imóveis */}
      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-warm-500">Carregando imóveis...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-warm-500 space-y-3">
            <Building2 size={40} className="mx-auto text-warm-300" />
            <p className="text-sm">Nenhum imóvel encontrado com os critérios selecionados.</p>
            <Link to="/admin/properties/new" className="btn btn-primary text-xs py-2 px-4 inline-flex">
              Cadastrar Primeiro Imóvel
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-warm-50 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-warm-200">
                  <th className="p-4">Imóvel</th>
                  <th className="p-4">Finalidade</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Corretor Responsável</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 text-xs">
                {filtered.map(property => (
                  <tr key={property.id} className="hover:bg-warm-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80'}
                          alt={property.title}
                          className="w-14 h-11 rounded-xl object-cover border shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-900 text-sm truncate max-w-xs">{property.title}</p>
                          <p className="text-[11px] text-warm-500">{property.neighborhood}, {property.city || 'São José dos Campos'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-navy-800">
                      {property.type}
                    </td>

                    <td className="p-4 font-bold text-navy-900 text-sm">
                      {property.price_display || `R$ ${Number(property.price_num || 0).toLocaleString('pt-BR')}`}
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-navy-900">{property.broker_name || 'Viva Belle Imobiliária'}</p>
                      <p className="text-[10px] text-warm-500">{property.broker_creci || 'CRECI 12345-J'}</p>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusBadges[property.status] || 'bg-warm-100 text-warm-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/imoveis/${property.id}`}
                          target="_blank"
                          className="p-1.5 text-warm-500 hover:text-gold-600 transition"
                          title="Ver anúncio público"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="p-1.5 text-warm-500 hover:text-navy-900 transition"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Link>

                        {property.status === 'ativo' && (
                          <>
                            <button
                              onClick={() => handleTogglePause(property.id, property.status, property.title)}
                              className="p-1.5 text-amber-600 hover:text-amber-700 transition"
                              title="Pausar anúncio"
                            >
                              <PauseCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleMarkSold(property.id, property.title)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 transition"
                              title="Marcar como Vendido"
                            >
                              <Award size={16} />
                            </button>
                          </>
                        )}

                        {property.status === 'inativo' && (
                          <button
                            onClick={() => handleTogglePause(property.id, property.status, property.title)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 transition"
                            title="Reativar no site"
                          >
                            <PlayCircle size={16} />
                          </button>
                        )}
                      </div>
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
