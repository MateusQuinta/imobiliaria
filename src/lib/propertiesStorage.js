import { PROPERTIES } from '../data'

const STORAGE_KEY = 'vivabelle_custom_properties'

// Normaliza um objeto de imóvel para garantir que todos os campos esperados existam
function normalizeProperty(p) {
  const priceVal = Number(p.price_num || p.priceNum || 0)
  const priceDisplay = p.price_display || p.priceDisplay || (
    p.type === 'ALUGUEL'
      ? `R$ ${priceVal.toLocaleString('pt-BR')}/mês`
      : `R$ ${priceVal.toLocaleString('pt-BR')}`
  )

  const gallery = Array.isArray(p.gallery) && p.gallery.length > 0
    ? p.gallery
    : (p.image ? [p.image] : [])

  return {
    id: p.id,
    title: p.title || 'Imóvel sem título',
    type: (p.type || 'VENDA').toUpperCase(),
    category: p.category || 'Casa',
    price_num: priceVal,
    priceNum: priceVal,
    price_display: priceDisplay,
    priceDisplay: priceDisplay,
    city: p.city || 'Taubaté',
    neighborhood: p.neighborhood || 'Centro',
    address: p.address || '',
    number: p.number || '',
    complement: p.complement || '',
    cep: p.cep || '',
    beds: Number(p.beds || 0),
    suites: Number(p.suites || 0),
    baths: Number(p.baths || 0),
    parking: Number(p.parking || 0),
    area: Number(p.area || 0),
    condo_fee: Number(p.condo_fee || p.condoFee || 0),
    iptu: Number(p.iptu || 0),
    status: p.status || 'ativo',
    moderation_status: p.moderation_status || 'publicado',
    featured: Boolean(p.featured),
    description: p.description || '',
    video_url: p.video_url || p.videoUrl || '',
    image: p.image || (gallery[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'),
    gallery: gallery,
    tags: Array.isArray(p.tags || p.amenities) ? (p.tags || p.amenities) : [],
    amenities: Array.isArray(p.amenities || p.tags) ? (p.amenities || p.tags) : [],
    broker_id: p.broker_id || null,
    broker_name: p.broker_name || 'Viva Belle Imobiliária',
    broker_creci: p.broker_creci || 'CRECI 12345-J',
    created_at: p.created_at || new Date().toISOString(),
    created_by: p.created_by || null
  }
}

// Retorna todos os imóveis (personalizados + padrão do sistema)
export function getStoredProperties(filterBrokerId = null) {
  let customList = []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        customList = parsed.map(normalizeProperty)
      }
    }
  } catch (err) {
    console.error('Erro ao ler imóveis do localStorage:', err)
  }

  const defaultList = PROPERTIES.map(normalizeProperty)

  // Junta lista customizada primeiro, depois os padrões que não foram sobrescritos
  const customIds = new Set(customList.map(c => String(c.id)))
  const merged = [
    ...customList,
    ...defaultList.filter(d => !customIds.has(String(d.id)))
  ]

  if (filterBrokerId) {
    return merged.filter(p => p.broker_id === filterBrokerId || p.created_by === filterBrokerId)
  }

  return merged
}

// Busca imóvel único por ID
export function getStoredPropertyById(id) {
  if (!id) return null
  const all = getStoredProperties()
  return all.find(p => String(p.id) === String(id)) || null
}

// Salva ou atualiza um imóvel
export function saveStoredProperty(propertyData, existingId = null) {
  const allCustom = []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) allCustom.push(...parsed)
    }
  } catch (err) {
    console.error(err)
  }

  const id = existingId || propertyData.id || `prop_${Date.now()}`
  const normalized = normalizeProperty({ ...propertyData, id })

  const existingIndex = allCustom.findIndex(p => String(p.id) === String(id))
  if (existingIndex >= 0) {
    allCustom[existingIndex] = normalized
  } else {
    allCustom.unshift(normalized)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allCustom))
  return normalized
}

// Atualiza status do imóvel (ex: vendido, pausado, ativo)
export function updateStoredPropertyStatus(id, newStatus) {
  const prop = getStoredPropertyById(id)
  if (!prop) return null
  return saveStoredProperty({ ...prop, status: newStatus }, id)
}

// Deleta um imóvel
export function deleteStoredProperty(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const filtered = parsed.filter(p => String(p.id) !== String(id))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    }
  } catch (err) {
    console.error(err)
  }
}
