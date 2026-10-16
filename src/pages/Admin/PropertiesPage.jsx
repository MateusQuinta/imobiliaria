import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProperties()
  }, [filter])

  async function fetchProperties() {
    setLoading(true)
    try {
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false })
      
      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      
      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      toast.error('Erro ao carregar imóveis')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja desativar este imóvel?')) return
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'inativo' })
        .eq('id', id)
      
      if (error) throw error
      toast.success('Imóvel desativado')
      fetchProperties()
    } catch (error) {
      toast.error('Erro ao desativar imóvel')
      console.error(error)
    }
  }

  const statusColors = {
    rascunho: 'bg-gray-200 text-gray-700',
    ativo: 'bg-green-100 text-green-700',
    inativo: 'bg-red-100 text-red-700',
    vendido: 'bg-blue-100 text-blue-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Imóveis</h1>
        <Link to="/admin/properties/new" className="btn btn-primary gap-2">
          <Plus size={20} />
          Novo Imóvel
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-warm-200">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-warm-500">Carregando...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-warm-500">Nenhum imóvel encontrado</div>
        ) : (
          <table className="w-full">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left p-4 font-semibold text-navy-900">Título</th>
                <th className="text-left p-4 font-semibold text-navy-900">Tipo</th>
                <th className="text-left p-4 font-semibold text-navy-900">Preço</th>
                <th className="text-left p-4 font-semibold text-navy-900">Status</th>
                <th className="text-left p-4 font-semibold text-navy-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} className="border-t border-warm-200 hover:bg-warm-50">
                  <td className="p-4">
                    <div className="font-medium text-navy-900">{property.title}</div>
                    <div className="text-sm text-warm-500">{property.neighborhood}</div>
                  </td>
                  <td className="p-4 text-navy-700">{property.type}</td>
                  <td className="p-4 text-navy-700">{property.price_display}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[property.status]}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/imoveis/${property.id}`}
                        target="_blank"
                        className="p-2 text-warm-500 hover:text-gold-500 transition-colors"
                        title="Ver no site"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/admin/properties/${property.id}/edit`}
                        className="p-2 text-warm-500 hover:text-gold-500 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 text-warm-500 hover:text-red-500 transition-colors"
                        title="Desativar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
