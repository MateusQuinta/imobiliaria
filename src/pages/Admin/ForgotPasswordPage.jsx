import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoWordmark } from '../../components/Logo'
import { Mail, ArrowRight, ShieldCheck, Info, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { isLocalMode } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLocalMode) {
        // No modo local, apenas simular
        await new Promise(r => setTimeout(r, 600))
        setSent(true)
        toast.success('Instruções enviadas (modo demonstração)')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/admin/redefinir-senha'
        })
        if (error) throw error
        setSent(true)
        toast.success('E-mail de recuperação enviado!')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação')
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
          <span className="text-xs font-bold uppercase tracking-wider">Recuperação de Acesso</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Esqueci minha senha</h1>
        <p className="text-warm-500 text-sm mb-6">
          Informe seu e-mail profissional e enviaremos as instruções de redefinição.
        </p>

        {/* Banner modo local */}
        {isLocalMode && !sent && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-2.5">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 mb-1">Modo Demonstração</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Recurso disponível após configurar o banco de dados Supabase. Em modo local, nenhum e-mail real é enviado.
                </p>
              </div>
            </div>
          </div>
        )}

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif text-xl font-bold text-navy-900">
              {isLocalMode ? 'Simulação concluída' : 'E-mail enviado!'}
            </h2>
            <p className="text-sm text-warm-500 leading-relaxed">
              {isLocalMode
                ? 'Em modo demonstração, nenhum e-mail real foi enviado. Configure o Supabase para ativar este recurso.'
                : `Enviamos as instruções para ${email}. Verifique sua caixa de entrada e o spam.`
              }
            </p>
            <Link
              to="/admin/login"
              className="btn btn-primary w-full justify-center py-3 text-sm font-semibold mt-4"
            >
              Voltar ao Login
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-3.5 text-sm font-semibold disabled:opacity-50 mt-2 shadow-md"
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {!sent && (
          <div className="mt-6 pt-5 border-t border-warm-100 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-warm-500 hover:text-navy-900 transition-colors font-medium"
            >
              ← Voltar ao login
            </Link>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-white/40 text-center">
        Viva Belle Imobiliária &middot; CRECI-SP 12345-J &middot; Vale do Paraíba
      </p>
    </div>
  )
}
