import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import ImageUploader from '../../components/Admin/ImageUploader'
import toast from 'react-hot-toast'

export default function PropertyFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEdit = !!id
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'VENDA',
    priceNum: 0,
    neighborhood: '',
    address: '',
    beds: 0,
    baths: 0,
    parking: 0,
    area: 0,
    status: 'rascunho',
    featured: false,
    description: ''
  })
  
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const priceDisplay = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(formData.priceNum)

      const propertyData = {
        ...formData,
        price_display: priceDisplay,
        image: images[0] || '',
        created_by: user.id,
        updated_by: user.id
      }

      let error
      if (isEdit) {
        const result = await supabase.from('properties').update(propertyData).eq('id', id)
        error = result.error
      } else {
        const result = await supabase.from('properties').insert(propertyData)
        error = result.error
      }

      if (error) throw error
      
      toast.success(isEdit ? 'Imóvel atualizado!' : 'Imóvel criado!')
      navigate('/admin/properties')
    } catch (error) {
      toast.error('Erro ao salvar imóvel')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">
        {isEdit ? 'Editar Imóvel' : 'Novo Imóvel'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="input-field"
            >
              <option value="VENDA">Venda</option>
              <option value="ALUGUEL">Aluguel</option>
              <option value="LANÇAMENTO">Lançamento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Preço (R$)</label>
            <input
              type="number"
              value={formData.priceNum}
              onChange={e => setFormData({...formData, priceNum: Number(e.target.value)})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Bairro</label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-navy-900 mb-1">Endereço</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Quartos</label>
            <input
              type="number"
              value={formData.beds}
              onChange={e => setFormData({...formData, beds: Number(e.target.value)})}
              className="input-field"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Banheiros</label>
            <input
              type="number"
              value={formData.baths}
              onChange={e => setFormData({...formData, baths: Number(e.target.value)})}
              className="input-field"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Vagas</label>
            <input
              type="number"
              value={formData.parking}
              onChange={e => setFormData({...formData, parking: Number(e.target.value)})}
              className="input-field"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Área (m²)</label>
            <input
              type="number"
              value={formData.area}
              onChange={e => setFormData({...formData, area: Number(e.target.value)})}
              className="input-field"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="input-field"
            >
              <option value="rascunho">Rascunho</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={e => setFormData({...formData, featured: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm font-medium text-navy-900">Destacar na home</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1">Descrição</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="input-field"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-900 mb-2">Imagens</label>
          <ImageUploader
            propertyId={id || 'new'}
            onImagesChange={setImages}
            existingImages={images}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
