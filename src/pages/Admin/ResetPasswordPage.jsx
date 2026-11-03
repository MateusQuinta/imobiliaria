import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogoWordmark } from '../../components/Logo'
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'A senha deve ter pelo menos 8 caracteres'
    if (!/[a-zA-Z]/.test(pwd)) return 'A senha deve conter letras'
    if (!/[0-9]/.test(pwd)) return 'A senha deve conter números'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validatePassword(password)
    if (validationError) {
      toast.error(validationError)
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      toast.success('Senha redefinida com sucesso!')
      setTimeout(() => navigate('/admin/login'), 2500)
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Erro ao redefinir senha. O link pode ter expirado.')
    } finally {
      setLoading(false)
    }
  }

  const passwordError = password ? validatePassword(password) : null
  const strength = password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
    ? 'forte'
    : password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
    ? 'bom'
    : password.length > 0
    ? 'fraco'
    : null

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
          <span className="text-xs font-bold uppercase tracking-wider">Redefinir Senha</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Nova senha</h1>
        <p className="text-warm-500 text-sm mb-6">
          Crie uma senha segura com no mínimo 8 caracteres, letras e números.
        </p>

        {done ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif text-xl font-bold text-navy-900">Senha redefinida!</h2>
            <p className="text-sm text-warm-500">Redirecionando para o login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-navy-900 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Indicador de força */}
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {['fraco', 'bom', 'forte'].map((lvl, i) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          (strength === 'fraco' && i === 0) ? 'bg-red-400' :
                          (strength === 'bom' && i <= 1) ? 'bg-amber-400' :
                          (strength === 'forte') ? 'bg-emerald-500' :
                          'bg-warm-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] font-semibold capitalize ${
                    strength === 'forte' ? 'text-emerald-600' :
                    strength === 'bom' ? 'text-amber-600' : 'text-red-500'
                  }`}>
                    {strength}
                  </span>
                </div>
              )}
              {passwordError && password && (
                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="input-field pl-10"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !!passwordError || password !== confirmPassword}
              className="btn btn-primary w-full justify-center py-3.5 text-sm font-semibold disabled:opacity-50 mt-2 shadow-md"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {!done && (
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
