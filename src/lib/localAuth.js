/**
 * Sistema de Autenticação Local (Fallback/Desenvolvimento)
 * Usado quando o Supabase não está disponível
 */

// Usuários pré-definidos para desenvolvimento/demonstração
const MOCK_USERS = [
  {
    id: 'admin-001',
    email: 'admin@vivabelle.com.br',
    password: 'Admin123!',
    name: 'Admin Principal',
    role: 'admin',
    status: 'active',
    creci: '12345-J',
    creci_uf: 'SP',
    creci_type: 'definitivo',
    city: 'São José dos Campos',
    phone: '(12) 99999-0001',
    avatar_url: null,
    bio: 'Diretor e administrador da Viva Belle Imobiliária.'
  },
  {
    id: 'corretor-001',
    email: 'corretor@vivabelle.com.br',
    password: 'Corretor123!',
    name: 'Carlos Oliveira',
    role: 'corretor',
    status: 'active',
    creci: '54321-F',
    creci_uf: 'SP',
    creci_type: 'definitivo',
    city: 'Taubaté',
    phone: '(12) 99888-7766',
    avatar_url: null,
    bio: 'Especialista em imóveis residenciais no Vale do Paraíba.'
  },
  {
    id: 'pendente-001',
    email: 'pendente@teste.com',
    password: 'Teste123!',
    name: 'José Pendente',
    role: 'corretor',
    status: 'pending',
    creci: '99999-G',
    creci_uf: 'SP',
    creci_type: 'provisorio',
    city: 'Jacareí',
    phone: '(12) 98888-5544',
    avatar_url: null,
    bio: ''
  }
]

const LOCAL_AUTH_KEY = 'vivabelle_local_auth'

export function localAuthLogin(email, password) {
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) {
    throw new Error('E-mail ou senha inválidos')
  }
  const { password: _p, ...safeUser } = user
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(safeUser))
  return safeUser
}

export function localAuthGetSession() {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function localAuthLogout() {
  localStorage.removeItem(LOCAL_AUTH_KEY)
}

export function getMockProperties(brokerId = null) {
  const base = [
    {
      id: 1,
      title: 'Casa em Condomínio Jardim Aquarius',
      type: 'casa',
      purpose: 'venda',
      price: 1250000,
      area: 280,
      bedrooms: 4,
      bathrooms: 3,
      suites: 2,
      parking: 3,
      city: 'São José dos Campos',
      neighborhood: 'Jardim Aquarius',
      status: 'ativo',
      moderation_status: 'publicado',
      broker_id: 'admin-001',
      broker_name: 'Admin Principal',
      broker_creci: '12345-J',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'Apartamento Alto Padrão Urbanova',
      type: 'apartamento',
      purpose: 'venda',
      price: 890000,
      area: 145,
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parking: 2,
      city: 'São José dos Campos',
      neighborhood: 'Urbanova',
      status: 'ativo',
      moderation_status: 'publicado',
      broker_id: 'corretor-001',
      broker_name: 'Carlos Oliveira',
      broker_creci: '54321-F',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'Terreno Jardim das Colinas',
      type: 'terreno',
      purpose: 'venda',
      price: 320000,
      area: 600,
      bedrooms: 0,
      bathrooms: 0,
      suites: 0,
      parking: 0,
      city: 'São José dos Campos',
      neighborhood: 'Jardim das Colinas',
      status: 'vendido',
      moderation_status: 'vendido',
      broker_id: 'admin-001',
      broker_name: 'Admin Principal',
      broker_creci: '12345-J',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  if (brokerId) return base.filter(p => p.broker_id === brokerId)
  return base
}

export function getMockLeads(brokerId = null) {
  const base = [
    {
      id: 'lead-001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(12) 99111-2233',
      subject: 'Interesse em Casa Jardim Aquarius',
      message: 'Gostaria de agendar uma visita para o final de semana.',
      property_title: 'Casa em Condomínio Jardim Aquarius',
      broker_id: 'admin-001',
      status: 'novo',
      notes: '',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lead-002',
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(12) 98222-3344',
      subject: 'Quero saber mais sobre apartamento Urbanova',
      message: 'Vi o apartamento no site e tenho interesse. Pode me chamar?',
      property_title: 'Apartamento Alto Padrão Urbanova',
      broker_id: 'corretor-001',
      status: 'em_contato',
      notes: 'Ligação feita em 24/10. Aguardando resposta.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lead-003',
      name: 'Ana Ferreira',
      email: 'ana@email.com',
      phone: '(12) 97333-4455',
      subject: 'Proposta pelo Jardim Aquarius',
      message: 'Quero fazer uma proposta. Podemos conversar?',
      property_title: 'Casa em Condomínio Jardim Aquarius',
      broker_id: 'admin-001',
      status: 'proposta',
      notes: 'Proposta recebida: R$ 1.150.000. Em negociação.',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  if (brokerId) return base.filter(l => l.broker_id === brokerId)
  return base
}

export function getMockBrokers() {
  return [
    {
      id: 'corretor-001',
      name: 'Carlos Oliveira',
      email: 'corretor@vivabelle.com.br',
      phone: '(12) 99888-7766',
      creci: '54321-F',
      creci_uf: 'SP',
      creci_type: 'definitivo',
      city: 'Taubaté',
      status: 'active',
      role: 'corretor',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'pendente-001',
      name: 'José Pendente',
      email: 'pendente@teste.com',
      phone: '(12) 98888-5544',
      creci: '99999-G',
      creci_uf: 'SP',
      creci_type: 'provisorio',
      city: 'Jacareí',
      status: 'pending',
      role: 'corretor',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

export function getMockVisits(brokerId = null) {
  const base = [
    {
      id: 'visit-001',
      lead_name: 'Maria Silva',
      lead_phone: '(12) 99111-2233',
      property_title: 'Casa em Condomínio Jardim Aquarius',
      scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduled_time: '10:00',
      status: 'agendada',
      broker_id: 'admin-001',
      notes: 'Cliente prefere manhã.'
    },
    {
      id: 'visit-002',
      lead_name: 'João Santos',
      lead_phone: '(12) 98222-3344',
      property_title: 'Apartamento Alto Padrão Urbanova',
      scheduled_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduled_time: '14:30',
      status: 'agendada',
      broker_id: 'corretor-001',
      notes: ''
    }
  ]
  if (brokerId) return base.filter(v => v.broker_id === brokerId)
  return base
}

export function getMockCommissions(brokerId = null) {
  const base = [
    {
      id: 'comm-001',
      property_title: 'Terreno Jardim das Colinas',
      sale_price: 320000,
      commission_rate: 5,
      commission_amount: 16000,
      broker_id: 'admin-001',
      broker_name: 'Admin Principal',
      status: 'pago',
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  if (brokerId) return base.filter(c => c.broker_id === brokerId)
  return base
}
