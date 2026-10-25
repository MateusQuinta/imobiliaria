import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogoWordmark } from '../../components/Logo'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, profile } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await login(email, password)
      toast.success('Login realizado com sucesso')

      // Aguardar profile carregar e verificar status
      setTimeout(async () => {
        // Verificar status do profile atualizado
        if (profile?.status === 'pending') {
          navigate('/cadastro-em-analise')
        } else if (profile?.status === 'suspended' || profile?.status === 'rejected') {
          navigate('/conta-suspensa')
        } else if (profile?.status === 'active' || profile?.status === 'approved') {
          navigate('/admin/dashboard')
        } else {
          // Se não tem profile ou status indefinido, vai para dashboard
          navigate('/admin/dashboard')
        }
      }, 500)
    } catch (error) {
      console.error(error)
      toast.error('E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 px-6 py-12">
      <div className="mb-8">
        <Link to="/">
          <LogoWordmark size="md" dark />
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl border border-warm-200">
        <div className="flex items-center gap-2 mb-2 text-gold-600">
          <ShieldCheck size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Acesso Restrito</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Painel de Acesso</h1>
        <p className="text-warm-500 text-sm mb-6">Corretores credenciados e administradores.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">E-mail Profissional</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@vivabelle.com.br"
                className="input-field pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider">Senha</label>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-3.5 text-sm font-semibold disabled:opacity-50 mt-2 shadow-md"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
            <ArrowRight size={16} />
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-warm-100 text-center space-y-3">
          <p className="text-xs text-warm-600">
            Ainda não faz parte da nossa equipe?
          </p>
          <Link
            to="/seja-um-corretor"
            className="btn btn-primary w-full justify-center text-xs py-2.5 font-semibold shadow-md"
          >
            Seja um Corretor Parceiro
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-white/40 text-center">
        Viva Belle Imobiliária &middot; CRECI-SP 12345-J &middot; Vale do Paraíba
      </p>
    </div>
  )
}
