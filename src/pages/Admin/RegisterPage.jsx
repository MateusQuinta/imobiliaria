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
