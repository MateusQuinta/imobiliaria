import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogoWordmark } from '../../components/Logo'
import { Lock, Mail, ArrowRight, ShieldCheck, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isLocalMode } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)
      const prof = result?.user || result

      toast.success('Login realizado com sucesso!')

      // Redirecionar com base no status
      setTimeout(() => {
        if (prof?.status === 'pending') {
          navigate('/cadastro-em-analise')
        } else if (prof?.status === 'suspended' || prof?.status === 'rejected') {
          navigate('/conta-suspensa')
        } else {
          navigate('/admin/dashboard')
        }
      }, 300)
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  const fillAdmin = () => {
    setEmail('admin@vivabelle.com.br')
    setPassword('Admin123!')
  }
  const fillCorretor = () => {
    setEmail('corretor@vivabelle.com.br')
    setPassword('Corretor123!')
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

        {/* Banner de modo local */}
        {isLocalMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-2.5">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 mb-1.5">Modo Demonstração</p>
                <p className="text-xs text-amber-700 mb-3 leading-relaxed">
                  O banco de dados está offline. Use uma das contas abaixo para explorar o painel completo.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillAdmin}
                    className="flex-1 text-[11px] font-bold bg-navy-900 text-white py-2 px-3 rounded-lg hover:bg-navy-800 transition-colors"
                  >
                    👑 Entrar como Admin
                  </button>
                  <button
                    type="button"
                    onClick={fillCorretor}
                    className="flex-1 text-[11px] font-bold bg-white text-navy-900 border border-navy-200 py-2 px-3 rounded-lg hover:bg-warm-50 transition-colors"
                  >
                    🏠 Entrar como Corretor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              E-mail Profissional
            </label>
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
              <Link
                to="/admin/esqueci-senha"
                className="text-[11px] font-semibold text-gold-600 hover:text-gold-700 hover:underline transition-colors"
              >
                Esqueci minha senha
              </Link>
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
            className="btn btn-secondary w-full justify-center text-xs py-2.5 font-semibold text-navy-900 border-warm-300 hover:bg-warm-100"
          >
            Seja um Corretor Parceiro
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-white/40 text-center">
        Viva Belle Imobiliária &middot; CRECI-SP 12345-J &middot; Taubaté - SP
      </p>
    </div>
  )
}
