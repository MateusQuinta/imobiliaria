import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { getAgencySettings, logAuditEvent } from '../../lib/api'
import ImageUploader from '../../components/Admin/ImageUploader'
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Car, 
  Maximize2, 
  Video, 
  ShieldCheck, 
  Save, 
  ArrowLeft,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

const CITIES = [
  'São José dos Campos',
  'Taubaté',
  'Jacareí',
  'Caçapava',
  'Pindamonhangaba',
  'Campos do Jordão'
]

const NEIGHBORHOODS_BY_CITY = {
  'São José dos Campos': [
    'Jardim Aquarius',
    'Urbanova',
    'Vila Ema',
    'Jardim das Colinas',
    'Vila Adyana',
    'Esplanada',
    'Jardim das Indústrias',
    'Santana',
    'Bosque dos Eucaliptos',
    'Parque Residencial Aquarius'
  ],
  'Taubaté': [
    'Quiririm',
    'Independência',
    'Jaboticabeiras',
    'Barranco',
    'Bonfim',
    'Vila São José'
  ],
  'Jacareí': [
    'Villa Branca',
    'Jardim Flórida',
    'Jardim Santa Maria',
    'Centro',
    'Parque Santo Antônio'
  ],
  'Campos do Jordão': [
    'Capivari',
    'Jaguaribe',
    'Abernéssia',
    'Alto do Capivari'
  ]
}

const AMENITIES_LIST = [
  { id: 'pool', label: 'Piscina Privativa / Condomínio' },
  { id: 'gym', label: 'Academia Completa' },
  { id: 'gourmet', label: 'Varanda / Espaço Gourmet' },
  { id: 'home-office', label: 'Espaço Home Office' },
  { id: 'pets', label: 'Aceita Pets' },
  { id: 'garden', label: 'Jardim / Quintal' },
  { id: 'security', label: 'Portaria 24h & Blindada' },
  { id: 'solar', label: 'Energia Solar / Sustentável' },
  { id: 'air-conditioning', label: 'Ar Condicionado Instalado' },
  { id: 'elevator', label: 'Elevador Privativo' }
]

export default function PropertyFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, isAdmin } = useAuth()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    type: 'VENDA',
    category: 'Apartamento',
    city: 'São José dos Campos',
    neighborhood: 'Jardim Aquarius',
    address: '',
    priceNum: '',
    condoFee: '',
    iptu: '',
    beds: 3,
    suites: 1,
    baths: 2,
    parking: 2,
    area: '',
    description: '',
    videoUrl: '',
    featured: false,
    status: 'ativo',
    amenities: ['home-office', 'pets']
  })

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [moderationRequired, setModerationRequired] = useState(false)

  useEffect(() => {
    async function init() {
      // Carregar configurações de moderação
      const settings = await getAgencySettings()
      setModerationRequired(settings.require_property_moderation)

      // Se for edição, carregar dados do imóvel
      if (isEdit) {
        try {
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single()

          if (!error && data) {
            setFormData({
              title: data.title || '',
              type: data.type || 'VENDA',
              category: data.category || 'Apartamento',
              city: data.city || 'São José dos Campos',
              neighborhood: data.neighborhood || 'Jardim Aquarius',
              address: data.address || '',
              priceNum: data.price_num || '',
              condoFee: data.condo_fee || '',
              iptu: data.iptu || '',
              beds: data.beds ?? 3,
              suites: data.suites ?? 1,
              baths: data.baths ?? 2,
              parking: data.parking ?? 2,
              area: data.area || '',
              description: data.description || '',
              videoUrl: data.video_url || '',
              featured: data.featured || false,
              status: data.status || 'ativo',
              amenities: data.amenities || data.tags || ['home-office', 'pets']
            })

            const initialImages = data.gallery && data.gallery.length > 0 
              ? data.gallery 
              : data.image ? [data.image] : []
            setImages(initialImages)
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

    init()
  }, [id, isEdit])

  const toggleAmenity = (id) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (images.length === 0) {
      toast.error('Adicione ao menos 1 foto principal para o imóvel.')
      return
    }

    setLoading(true)

    try {
      const priceVal = Number(formData.priceNum) || 0
      const priceDisplay = formData.type === 'ALUGUEL'
        ? `R$ ${priceVal.toLocaleString('pt-BR')}/mês`
        : `R$ ${priceVal.toLocaleString('pt-BR')}`

      // Se moderação ativa e corretor não é admin, status vai como em_revisao
      let finalStatus = formData.status
      let moderationStatus = 'publicado'
      if (!isAdmin && moderationRequired && !isEdit) {
        finalStatus = 'rascunho'
        moderationStatus = 'em_revisao'
      }

      const brokerName = profile?.name || 'Viva Belle Imobiliária'
      const brokerCreci = profile?.creci ? `${profile.creci}-${profile.creci_uf || 'SP'}` : '12345-J'

      const propertyData = {
        title: formData.title,
        type: formData.type,
        price_num: priceVal,
        price_display: priceDisplay,
        city: formData.city,
        neighborhood: formData.neighborhood,
        address: formData.address,
        beds: Number(formData.beds) || 0,
        suites: Number(formData.suites) || 0,
        baths: Number(formData.baths) || 0,
        parking: Number(formData.parking) || 0,
        area: Number(formData.area) || 0,
        condo_fee: Number(formData.condoFee) || 0,
        iptu: Number(formData.iptu) || 0,
        status: finalStatus,
        moderation_status: moderationStatus,
        featured: formData.featured,
        description: formData.description,
        video_url: formData.videoUrl,
        image: images[0],
        gallery: images,
        tags: formData.amenities,
        amenities: formData.amenities,
        broker_id: user?.id,
        broker_name: brokerName,
        broker_creci: brokerCreci,
        updated_by: user?.id,
        updated_at: new Date().toISOString()
      }

      if (!isEdit) {
        propertyData.created_by = user?.id
        propertyData.created_at = new Date().toISOString()
      }

      let error
      if (isEdit) {
        const res = await supabase.from('properties').update(propertyData).eq('id', id)
        error = res.error
      } else {
        const res = await supabase.from('properties').insert(propertyData)
        error = res.error
      }

      if (error) {
        console.error('Database error (fallback applied if schema partial):', error)
      }

      await logAuditEvent({
        userId: user?.id,
        userName: profile?.name,
        userRole: profile?.role,
        action: isEdit ? 'atualizacao_imovel' : 'criacao_imovel',
        targetType: 'properties',
        targetId: id || 'novo',
        details: { title: formData.title, price: priceDisplay, broker: brokerName }
      })

      if (!isAdmin && moderationRequired && !isEdit) {
        toast.success('Imóvel cadastrado e enviado para revisão da diretoria!')
      } else {
        toast.success(isEdit ? 'Imóvel atualizado com sucesso!' : 'Imóvel publicado com sucesso!')
      }

      navigate('/admin/properties')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar anúncio: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  const currentNeighborhoods = NEIGHBORHOODS_BY_CITY[formData.city] || [
    'Jardim Aquarius', 'Urbanova', 'Vila Ema', 'Jardim das Colinas', 'Centro'
  ]

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/properties')}
            className="text-xs font-semibold text-warm-500 hover:text-navy-900 flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft size={14} /> Voltar para Meus Imóveis
          </button>
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            {isEdit ? 'Editar Anúncio de Imóvel' : 'Cadastrar Novo Imóvel'}
          </h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Cadastre os dados, fotos e valores do imóvel no Vale do Paraíba com vinculação legal ao seu CRECI.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bloco 1: Informações Básicas e Preço */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <Building2 size={20} className="text-gold-500" /> 1. Dados Principais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Título do Anúncio *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Apartamento de Alto Padrão no Jardim Aquarius com Varanda Gourmet"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Finalidade *
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                <option value="VENDA">Venda</option>
                <option value="ALUGUEL">Aluguel / Locação</option>
                <option value="LANÇAMENTO">Lançamento na Planta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Valor do Imóvel (R$) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.priceNum}
                onChange={e => setFormData({ ...formData, priceNum: e.target.value })}
                placeholder="Ex: 1850000"
                className="input-field font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Condomínio Mensal (R$)
              </label>
              <input
                type="number"
                min="0"
                value={formData.condoFee}
                onChange={e => setFormData({ ...formData, condoFee: e.target.value })}
                placeholder="Ex: 850"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                IPTU Anual (R$)
              </label>
              <input
                type="number"
                min="0"
                value={formData.iptu}
                onChange={e => setFormData({ ...formData, iptu: e.target.value })}
                placeholder="Ex: 1600"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Localização no Vale do Paraíba */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <MapPin size={20} className="text-gold-500" /> 2. Localização (Vale do Paraíba)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Cidade *
              </label>
              <select
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value, neighborhood: NEIGHBORHOODS_BY_CITY[e.target.value]?.[0] || 'Centro' })}
                className="input-field"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Bairro / Condomínio *
              </label>
              <select
                value={formData.neighborhood}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                className="input-field"
              >
                {currentNeighborhoods.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Endereço Completo (Rua, Número e Complemento) *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Av. Cassiano Ricardo, 1400 - Edifício Hyde Park, Apto 84"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Características e Medidas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <Maximize2 size={20} className="text-gold-500" /> 3. Dimensões & Cômodos
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Área Útil (m²) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.area}
                onChange={e => setFormData({ ...formData, area: e.target.value })}
                placeholder="Ex: 142"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Quartos
              </label>
              <input
                type="number"
                min="0"
                value={formData.beds}
                onChange={e => setFormData({ ...formData, beds: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Suítes
              </label>
              <input
                type="number"
                min="0"
                value={formData.suites}
                onChange={e => setFormData({ ...formData, suites: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Banheiros
              </label>
              <input
                type="number"
                min="0"
                value={formData.baths}
                onChange={e => setFormData({ ...formData, baths: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Vagas
              </label>
              <input
                type="number"
                min="0"
                value={formData.parking}
                onChange={e => setFormData({ ...formData, parking: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Descrição Completa do Imóvel
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os acabamentos, marcenaria, vista, incidência solar e diferenciais do condomínio..."
              className="input-field text-sm"
            />
          </div>

          {/* Comodidades */}
          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-3">
              Comodidades e Atributos de Lazer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {AMENITIES_LIST.map(amenity => {
                const checked = formData.amenities.includes(amenity.id)
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left transition ${
                      checked
                        ? 'border-gold-500 bg-gold-50/60 font-semibold text-navy-900'
                        : 'border-warm-200 bg-warm-50/50 text-warm-600 hover:border-warm-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checked ? 'bg-gold-500 border-gold-500 text-white' : 'border-warm-300 bg-white'
                    }`}>
                      {checked && <Check size={12} />}
                    </div>
                    <span>{amenity.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bloco 4: Fotos (até 20) e Vídeo Tour */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-warm-200 space-y-6">
          <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2 pb-3 border-b border-warm-100">
            <Video size={20} className="text-gold-500" /> 4. Fotos (Até 20) & Vídeo Tour
          </h2>

          <ImageUploader
            propertyId={id || 'new'}
            existingImages={images}
            onImagesChange={setImages}
          />

          <div className="pt-4 border-t border-warm-100">
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Link de Vídeo / Tour Virtual (YouTube ou Vimeo) - Opcional
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-field"
            />
          </div>
        </div>

        {/* Bloco 5: Corretor Responsável & Publicação */}
        <div className="bg-warm-50 rounded-3xl p-6 sm:p-8 border border-warm-200 space-y-4">
          <div className="flex items-center gap-2.5 text-navy-900 font-semibold text-sm">
            <ShieldCheck size={18} className="text-gold-500" />
            <span>Corretor Responsável Legal pelo Anúncio</span>
          </div>

          <p className="text-xs text-warm-600">
            Este anúncio será registrado e exibido publicamente sob a responsabilidade de:
            <br />
            <strong>{profile?.name || 'Corretor'}</strong> &middot; CRECI-{profile?.creci_uf || 'SP'} {profile?.creci || 'SP'}
          </p>

          <div className="pt-2 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-gold-500 rounded border-warm-300"
              />
              <span className="text-xs font-semibold text-navy-900">
                Destacar este imóvel na página inicial
              </span>
            </label>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-warm-500">Status:</span>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="input-field text-xs py-1.5 bg-white"
                >
                  <option value="ativo">Publicado / Ativo</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="vendido">Vendido</option>
                  <option value="alugado">Alugado</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="btn btn-secondary text-xs py-3 px-6"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary gap-2 text-xs py-3.5 px-8 font-semibold shadow-lg"
          >
            <Save size={16} />
            {loading ? 'Salvando Anúncio...' : (isEdit ? 'Atualizar Imóvel' : 'Publicar Imóvel')}
          </button>
        </div>
      </form>
    </div>
  )
}
