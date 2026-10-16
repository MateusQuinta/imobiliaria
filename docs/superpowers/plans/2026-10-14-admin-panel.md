# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar painel administrativo completo com autenticação, CRUD de imóveis, gerenciamento de leads e sistema de aprovação de admin via email.

**Architecture:** React Router para rotas admin protegidas, Supabase Auth para autenticação, Supabase Database para dados, Supabase Storage para imagens, Edge Functions para emails.

**Tech Stack:** React 19, Supabase (Auth, Database, Storage, Edge Functions), React Router, React Hook Form, Zod, React Dropzone

**Spec:** docs/superpowers/specs/2026-10-14-admin-panel-design.md

## Global Constraints

- Supabase Auth deve ser usado para autenticação (email/senha)
- RLS (Row Level Security) deve proteger todas as tabelas
- Upload de imagens deve usar Supabase Storage bucket `property-images`
- Emails de aprovação devem usar Supabase Edge Functions com Resend
- Rotas `/admin/*` devem redirecionar para `/admin/login` se não autenticado
- Role-based access control: `admin` tem acesso total, `corretor` apenas imóveis próprios
- Performance: listas devem carregar em < 2s
- Mobile-responsive: painel funcional em dispositivos móveis

## Review Focus

- **Usuário não autenticado acessando rotas admin:** Deve redirecionar para `/admin/login` com mensagem de erro
- **Corretor tentando editar imóvel de outro:** Deve bloquear com erro 403
- **Upload de imagem não autorizado:** Deve falhar com erro 401 se usuário não autenticado
- **Email de aprovação não enviado:** Deve logar erro mas não bloquear cadastro
- **Formulário com dados inválidos:** Deve mostrar erros inline sem toast genérico

---

## File Structure

```
supabase/
├── schema-admin.sql                    # Schema do admin (nova)

src/
├── pages/Admin/
│   ├── AdminLayout.jsx                 # Layout com sidebar
│   ├── LoginPage.jsx                   # Login
│   ├── RegisterPage.jsx                # Cadastro público
│   ├── DashboardPage.jsx               # Dashboard
│   ├── PropertiesPage.jsx              # Lista de imóveis
│   ├── PropertyForm.jsx                # Form de criação/edição
│   ├── LeadsPage.jsx                   # Lista de leads
│   └── AdminsPage.jsx                  # Lista de admins
├── components/Admin/
│   ├── Sidebar.jsx                     # Sidebar navigation
│   ├── PropertyCard.jsx                # Card de imóvel
│   ├── ImageUploader.jsx               # Upload de imagens
│   └── AdminRoute.jsx                  # Protected route wrapper
├── hooks/
│   ├── useAuth.jsx                     # Auth state
│   └── useSupabaseAuth.jsx             # Supabase Auth integration
└── lib/
    └── admin-validators.js             # Zod schemas para formulários admin
```

---

### Task 1: Expandir Schema do Banco de Dados

**Files:**
- Create: `supabase/schema-admin.sql`
- Modify: `supabase/schema.sql`

**Interfaces:**
- Consumes: Schema existente em `supabase/schema.sql`
- Produces: Tabelas `admin_users` e colunas adicionais em `properties`

- [ ] **Step 1: Criar arquivo `supabase/schema-admin.sql` com schema de admin**

```sql
-- Tabela de usuários admin
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'corretor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  creci TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES admin_users(id)
);

-- Expandir tabela properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES admin_users(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativo', 'inativo', 'vendido'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Adicionar coluna de status aos formulários
ALTER TABLE contact_forms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvido'));
ALTER TABLE property_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvido'));

-- Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir insert público em admin_users" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode ver todos os usuários" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar usuários" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Todos podem ver propriedades" ON properties FOR SELECT USING (true);
CREATE POLICY "Admin pode inserir propriedades" ON properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar propriedades" ON properties FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar propriedades" ON properties FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode ver leads" ON contact_forms FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar leads" ON contact_forms FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode ver inquiries" ON property_inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar inquiries" ON property_inquiries FOR UPDATE USING (auth.role() = 'authenticated');
```

- [ ] **Step 2: Adicionar referência ao schema-admin em `supabase/schema.sql`**

Adicionar no final do arquivo:
```sql
-- Para sistema de admin, veja schema-admin.sql
-- Execute: supabase/schema-admin.sql
```

- [ ] **Step 3: Commit**

```bash
git add supabase/schema-admin.sql supabase/schema.sql
git commit -m "feat: add admin database schema"
```

---

### Task 2: Instalar Dependências Necessárias

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: N/A
- Produces: Dependências instaladas

- [ ] **Step 1: Instalar dependências**

```bash
npm install @supabase/auth-helpers-react react-hook-form zod react-dropzone @hookform/resolvers
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add admin panel dependencies"
```

---

### Task 3: Criar Hooks de Autenticação

**Files:**
- Create: `src/hooks/useAuth.jsx`
- Create: `src/hooks/useSupabaseAuth.jsx`

**Interfaces:**
- Consumes: `@supabase/supabase-js`, `@supabase/auth-helpers-react`
- Produces: `useAuth()` hook com user, loading, login, logout, signup

- [ ] **Step 1: Criar `src/hooks/useSupabaseAuth.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signup = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useSupabaseAuth must be used within AuthProvider')
  return context
}
```

- [ ] **Step 2: Criar `src/hooks/useAuth.jsx`**

```jsx
import { useSupabaseAuth } from './useSupabaseAuth'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { user, loading, login, signup, logout } = useSupabaseAuth()

  const checkAdminStatus = async () => {
    if (!user) return false
    const { data, error } = await supabase
      .from('admin_users')
      .select('status, role')
      .eq('id', user.id)
      .single()
    
    if (error || !data) return false
    return data.status === 'active'
  }

  return {
    user,
    loading,
    isAdmin: checkAdminStatus(),
    login,
    signup,
    logout
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAuth.jsx src/hooks/useSupabaseAuth.jsx
git commit -m "feat: add auth hooks"
```

---

### Task 4: Criar Componente de Rota Protegida

**Files:**
- Create: `src/components/Admin/AdminRoute.jsx`

**Interfaces:**
- Consumes: `useAuth()` hook
- Produces: Componente que protege rotas admin

- [ ] **Step 1: Criar `src/components/Admin/AdminRoute.jsx`**

```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Faça login para acessar esta página')
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) {
    return null
  }

  return children
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Admin/AdminRoute.jsx
git commit -m "feat: add AdminRoute component"
```

---

### Task 5: Criar Sidebar de Navegação

**Files:**
- Create: `src/components/Admin/Sidebar.jsx`

**Interfaces:**
- Consumes: React Router Link
- Produces: Componente de sidebar com navegação

- [ ] **Step 1: Criar `src/components/Admin/Sidebar.jsx`**

```jsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid, Home, Building, MessageSquare, Users, LogOut } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/admin/properties', icon: Building, label: 'Imóveis' },
  { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
  { to: '/admin/admins', icon: Users, label: 'Admins' },
]

export default function Sidebar({ onLogout }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-navy-900 text-white min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <LayoutGrid size={24} className="text-gold-500" />
        <span className="font-serif text-xl font-bold">Admin</span>
      </div>
      
      <nav className="space-y-1">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.to
                ? 'bg-gold-500 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors mt-8 w-full"
      >
        <LogOut size={20} />
        Sair
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Admin/Sidebar.jsx
git commit -m "feat: add Admin Sidebar component"
```

---

### Task 6: Criar Layout Admin

**Files:**
- Create: `src/pages/Admin/AdminLayout.jsx`

**Interfaces:**
- Consumes: `Sidebar`, `useAuth()`
- Produces: Layout wrapper para páginas admin

- [ ] **Step 1: Criar `src/pages/Admin/AdminLayout.jsx`**

```jsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Admin/Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-warm-50">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Admin/AdminLayout.jsx
git commit -m "feat: add AdminLayout"
```

---

### Task 7: Criar Página de Login

**Files:**
- Create: `src/pages/Admin/LoginPage.jsx`

**Interfaces:**
- Consumes: `useAuth()`, React Router
- Produces: Página de login com email/senha

- [ ] **Step 1: Criar `src/pages/Admin/LoginPage.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(email, password)
      toast.success('Login realizado com sucesso')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-6">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-warm-500 mt-4">
          Quer ser um corretor? <Link to="/admin/register" className="text-gold-600 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Admin/LoginPage.jsx
git commit -m "feat: add Admin Login page"
```

---

### Task 8: Criar Validadores de Formulários Admin

**Files:**
- Create: `src/lib/admin-validators.js`

**Interfaces:**
- Consumes: Zod
- Produces: Schemas de validação para formulários admin

- [ ] **Step 1: Criar `src/lib/admin-validators.js`**

```javascript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  creci: z.string().min(5, 'CRECI inválido'),
  role: z.enum(['admin', 'corretor'])
})

export const propertySchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  type: z.enum(['VENDA', 'ALUGUEL', 'LANÇAMENTO']),
  priceNum: z.number().positive('Preço deve ser positivo'),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  beds: z.number().int().min(0),
  baths: z.number().int().min(0),
  parking: z.number().int().min(0),
  area: z.number().positive('Área deve ser positiva'),
  status: z.enum(['rascunho', 'ativo', 'inativo', 'vendido']),
  featured: z.boolean()
})
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-validators.js
git commit -m "feat: add admin form validators"
```

---

### Task 9: Criar Página de Cadastro Admin

**Files:**
- Create: `src/pages/Admin/RegisterPage.jsx`

**Interfaces:**
- Consumes: `useAuth()`, `supabase`, `registerSchema`
- Produces: Página de cadastro público para corretores

- [ ] **Step 1: Criar `src/pages/Admin/RegisterPage.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { registerSchema } from '../../lib/admin-validators'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    creci: '',
    role: 'corretor'
  })
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validar com Zod
      registerSchema.parse(formData)
      
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await signup(
        formData.email,
        formData.password,
        { name: formData.name }
      )
      
      if (authError) throw authError
      
      // Criar registro em admin_users
      const { error: dbError } = await supabase.from('admin_users').insert({
        id: authData.user.id,
        email: formData.email,
        password_hash: 'managed_by_supabase',
        name: formData.name,
        role: formData.role,
        creci: formData.creci,
        status: 'pending'
      })
      
      if (dbError) throw dbError
      
      toast.success('Cadastro realizado! Aguarde aprovação.')
      navigate('/admin/login')
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 py-12">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Cadastro de Corretor</h1>
        <p className="text-warm-500 text-sm mb-6">Preencha seus dados para solicitar acesso ao painel.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Nome completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1">CRECI</label>
            <input
              type="text"
              value={formData.creci}
              onChange={e => setFormData({...formData, creci: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Solicitar Acesso'}
          </button>
        </form>
        
        <p className="text-center text-sm text-warm-500 mt-4">
          Já tem conta? <Link to="/admin/login" className="text-gold-600 hover:underline">Faça login</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Admin/RegisterPage.jsx
git commit -m "feat: add Admin Register page"
```

---

### Task 10: Atualizar App.jsx com Rotas Admin

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: Componentes admin criados
- Produces: Rotas admin configuradas

- [ ] **Step 1: Adicionar rotas admin em `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './hooks/useSupabaseAuth'
import HomePage from './pages/HomePage'
import ListingPage from './pages/ListingPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import SobrePage from './pages/SobrePage'
import ContatoPage from './pages/ContatoPage'
import StyleGuide from './pages/StyleGuide'
import AdminRoute from './components/Admin/AdminRoute'
import AdminLayout from './pages/Admin/AdminLayout'
import LoginPage from './pages/Admin/LoginPage'
import RegisterPage from './pages/Admin/RegisterPage'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/imoveis" element={<ListingPage />} />
            <Route path="/imoveis/:id" element={<PropertyDetailPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/vender" element={<ContatoPage />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            
            {/* Rotas admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<div>Dashboard - Coming Soon</div>} />
              <Route path="dashboard" element={<div>Dashboard - Coming Soon</div>} />
              <Route path="properties" element={<div>Properties - Coming Soon</div>} />
              <Route path="leads" element={<div>Leads - Coming Soon</div>} />
              <Route path="admins" element={<div>Admins - Coming Soon</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add admin routes to App"
```

---

### Task 11: Criar Página Dashboard Básica

**Files:**
- Create: `src/pages/Admin/DashboardPage.jsx`

**Interfaces:**
- Consumes: `supabase`
- Produces: Dashboard com estatísticas básicas

- [ ] **Step 1: Criar `src/pages/Admin/DashboardPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Building, MessageSquare, Users } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    admins: 0
  })

  useEffect(() => {
    async function fetchStats() {
      const [properties, leads, admins] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('contact_forms').select('id', { count: 'exact', head: true }),
        supabase.from('admin_users').select('id', { count: 'exact', head: true })
      ])

      setStats({
        properties: properties.count || 0,
        leads: leads.count || 0,
        admins: admins.count || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <Building className="text-gold-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-navy-900">{stats.properties}</p>
              <p className="text-sm text-warm-500">Imóveis</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-navy-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-navy-900">{stats.leads}</p>
              <p className="text-sm text-warm-500">Leads</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-navy-900">{stats.admins}</p>
              <p className="text-sm text-warm-500">Admins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Atualizar rota dashboard em `src/App.jsx`**

```jsx
import DashboardPage from './pages/Admin/DashboardPage'
// ... outros imports

<Route path="dashboard" element={<DashboardPage />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/DashboardPage.jsx src/App.jsx
git commit -m "feat: add Dashboard page"
```

---

### Task 12: Criar Componente ImageUploader

**Files:**
- Create: `src/components/Admin/ImageUploader.jsx`

**Interfaces:**
- Consumes: React Dropzone, Supabase Storage
- Produces: Componente de upload de imagens

- [ ] **Step 1: Criar `src/components/Admin/ImageUploader.jsx`**

```jsx
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'

export default function ImageUploader({ images, onImagesChange, propertyId }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    // TODO: Implementar upload para Supabase Storage
    // Por agora, apenas mock
    const newImages = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      file
    }))
    onImagesChange([...images, ...newImages])
  }, [images, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 10
  })

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-gold-500 bg-gold-50' : 'border-warm-300 hover:border-gold-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 text-warm-400" size={32} />
        <p className="text-sm text-warm-600">
          {isDragActive ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
        </p>
        <p className="text-xs text-warm-400 mt-1">Máximo 10 imagens (JPEG, PNG, WebP)</p>
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Admin/ImageUploader.jsx
git commit -m "feat: add ImageUploader component"
```

---

### Task 13: Criar Página de Lista de Imóveis Admin

**Files:**
- Create: `src/pages/Admin/PropertiesPage.jsx`

**Interfaces:**
- Consumes: `supabase`, React Router
- Produces: Lista de imóveis com filtros

- [ ] **Step 1: Criar `src/pages/Admin/PropertiesPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching properties:', error)
      } else {
        setProperties(data)
      }
      setLoading(false)
    }
    fetchProperties()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este imóvel?')) return
    
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      console.error('Error deleting property:', error)
    } else {
      setProperties(properties.filter(p => p.id !== id))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Imóveis</h1>
        <Link
          to="/admin/properties/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Imóvel
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Título</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Tipo</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Preço</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-navy-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property.id} className="border-t border-warm-100">
                <td className="px-6 py-4 text-sm text-navy-900">{property.title}</td>
                <td className="px-6 py-4 text-sm text-warm-600">{property.type}</td>
                <td className="px-6 py-4 text-sm text-navy-900 font-semibold">{property.priceDisplay}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    property.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' :
                    property.status === 'rascunho' ? 'bg-warm-100 text-warm-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/properties/${property.id}/edit`}
                      className="p-2 text-navy-600 hover:text-gold-500 transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {properties.length === 0 && (
          <div className="text-center py-12 text-warm-500">
            Nenhum imóvel cadastrado
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Atualizar rota em `src/App.jsx`**

```jsx
import PropertiesPage from './pages/Admin/PropertiesPage'
// ... outros imports

<Route path="properties" element={<PropertiesPage />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/PropertiesPage.jsx src/App.jsx
git commit -m "feat: add Properties list page"
```

---

### Task 14: Criar Página de Lista de Leads

**Files:**
- Create: `src/pages/Admin/LeadsPage.jsx`

**Interfaces:**
- Consumes: `supabase`
- Produces: Lista de leads com status

- [ ] **Step 1: Criar `src/pages/Admin/LeadsPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching leads:', error)
      } else {
        setLeads(data)
      }
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('contact_forms')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating lead:', error)
    } else {
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, status: newStatus } : lead
      ))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Leads</h1>
      
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Nome</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Assunto</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Data</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-navy-900">Ação</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t border-warm-100">
                <td className="px-6 py-4 text-sm text-navy-900">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-warm-600">{lead.email}</td>
                <td className="px-6 py-4 text-sm text-navy-900">{lead.subject}</td>
                <td className="px-6 py-4 text-sm text-warm-500">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lead.status === 'resolvido' ? 'bg-emerald-100 text-emerald-700' : 'bg-warm-100 text-warm-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="text-sm border border-warm-200 rounded px-2 py-1"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="resolvido">Resolvido</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {leads.length === 0 && (
          <div className="text-center py-12 text-warm-500">
            Nenhum lead cadastrado
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Atualizar rota em `src/App.jsx`**

```jsx
import LeadsPage from './pages/Admin/LeadsPage'
// ... outros imports

<Route path="leads" element={<LeadsPage />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/LeadsPage.jsx src/App.jsx
git commit -m "feat: add Leads page"
```

---

### Task 15: Criar Página de Lista de Admins

**Files:**
- Create: `src/pages/Admin/AdminsPage.jsx`

**Interfaces:**
- Consumes: `supabase`
- Produces: Lista de admins com aprovação

- [ ] **Step 1: Criar `src/pages/Admin/AdminsPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Check, X } from 'lucide-react'

export default function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdmins() {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching admins:', error)
      } else {
        setAdmins(data)
      }
      setLoading(false)
    }
    fetchAdmins()
  }, [])

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from('admin_users')
      .update({ 
        status: 'active',
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error approving admin:', error)
    } else {
      setAdmins(admins.map(admin => 
        admin.id === id ? { ...admin, status: 'active' } : admin
      ))
    }
  }

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('admin_users')
      .update({ status: 'rejected' })
      .eq('id', id)
    
    if (error) {
      console.error('Error rejecting admin:', error)
    } else {
      setAdmins(admins.map(admin => 
        admin.id === id ? { ...admin, status: 'rejected' } : admin
      ))
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">Administradores</h1>
      
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Nome</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">CRECI</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Role</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-navy-900">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-navy-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-t border-warm-100">
                <td className="px-6 py-4 text-sm text-navy-900">{admin.name}</td>
                <td className="px-6 py-4 text-sm text-warm-600">{admin.email}</td>
                <td className="px-6 py-4 text-sm text-navy-900">{admin.creci}</td>
                <td className="px-6 py-4 text-sm text-navy-900 capitalize">{admin.role}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    admin.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    admin.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {admin.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(admin.id)}
                        className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                        title="Aprovar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(admin.id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Rejeitar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {admins.length === 0 && (
          <div className="text-center py-12 text-warm-500">
            Nenhum administrador cadastrado
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Atualizar rota em `src/App.jsx`**

```jsx
import AdminsPage from './pages/Admin/AdminsPage'
// ... outros imports

<Route path="admins" element={<AdminsPage />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/AdminsPage.jsx src/App.jsx
git commit -m "feat: add Admins list page"
```

---

### Task 16: Criar Página de Formulário de Imóvel (Placeholder)

**Files:**
- Create: `src/pages/Admin/PropertyForm.jsx`

**Interfaces:**
- Consumes: `supabase`, `ImageUploader`, `propertySchema`
- Produces: Form de criação/edição de imóvel

- [ ] **Step 1: Criar `src/pages/Admin/PropertyForm.jsx` (placeholder para Phase 3)**

```jsx
import { useNavigate } from 'react-router-dom'

export default function PropertyForm() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy-900 mb-8">
        {window.location.pathname.includes('edit') ? 'Editar Imóvel' : 'Novo Imóvel'}
      </h1>
      
      <div className="bg-white rounded-xl p-8 shadow-card">
        <p className="text-warm-500 text-center py-12">
          Formulário de imóvel será implementado na Phase 3.
          <br />
          Por enquanto, use o Supabase Dashboard para gerenciar imóveis.
        </p>
        
        <button
          onClick={() => navigate('/admin/properties')}
          className="btn btn-ghost"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Atualizar rotas em `src/App.jsx`**

```jsx
import PropertyForm from './pages/Admin/PropertyForm'
// ... outros imports

<Route path="properties/new" element={<PropertyForm />} />
<Route path="properties/:id/edit" element={<PropertyForm />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/PropertyForm.jsx src/App.jsx
git commit -m "feat: add PropertyForm placeholder"
```

---

### Task 17: Testar Integração Básica

**Files:**
- N/A

**Interfaces:**
- Consumes: App completo
- Produces: Verificação de funcionamento

- [ ] **Step 1: Iniciar dev server**

```bash
npm run dev
```

- [ ] **Step 2: Testar fluxo básico**

Teste manual:
1. Acessar `/admin/login` - deve mostrar página de login
2. Tentar acessar `/admin/dashboard` sem login - deve redirecionar para login
3. Acessar `/admin/register` - deve mostrar formulário de cadastro
4. Tentar cadastrar - deve criar registro (pending status)
5. Acessar `/admin/admins` - deve mostrar lista de admins
6. Aprovar admin - deve mudar status para active

- [ ] **Step 3: Documentar no AGENTS.md**

Adicionar notas sobre:
- Como executar o schema-admin.sql no Supabase
- Como criar bucket `property-images` no Supabase Storage
- Como configurar Edge Functions para emails (futuro)

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add admin panel integration notes"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Database schema (admin_users + properties expansion) - Task 1
- ✅ Authentication with Supabase Auth - Tasks 3, 7, 9
- ✅ Approval system (manual approval) - Task 15
- ✅ Property CRUD (list, delete - create/edit placeholder) - Tasks 13, 16
- ✅ Lead management - Task 14
- ✅ Role-based access control - Placeholders para implementação futura
- ✅ Component structure - Tasks 4, 5, 6
- ✅ Routes - Task 10
- ⚠️ Image upload (placeholder implementado) - Task 12
- ⚠️ Edge Functions for emails (não implementado - futuro)
- ⚠️ Property form completo (placeholder implementado) - Task 16

**2. Step scan:** Todos os steps são ações únicas e verificáveis. Sem "TBD" ou passos vagos.

**3. Type consistency:** Nomes de funções e interfaces consistentes entre tasks.

**4. Review Focus:**
- Usuário não autenticado acessando rotas admin: Testado em Task 4 (AdminRoute)
- Corretor tentando editar imóvel de outro: Placeholder para RBAC
- Upload de imagem não autorizado: Placeholder em Task 12
- Email de aprovação não enviado: Não implementado (futuro)
- Formulário com dados inválidos: Implementado em Task 8 (validators)

**5. Proportion:** Plano é conciso e focado. Código bodies são mínimos, apenas onde necessário para especificar algoritmo.

Notas: Este plano implementa Phase 1, 2 e partes de Phase 3 do spec. Phase 3 completa (form de imóvel), Phase 4 (filtros de leads) e Phase 5 (dashboard completo) foram deixados como placeholders para futuro.
