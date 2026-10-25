import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AlertTriangle, LogOut, MessageCircle, Mail } from 'lucide-react'
import { LogoWordmark } from '../../components/Logo'

export default function ContaSuspensaPage() {
  const { user, profile, isApproved, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isApproved) {
      navigate('/admin/dashboard')
    }
  }, [isApproved, navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const isRejected = profile?.status === 'rejected'
  const reason = profile?.rejection_reason || profile?.correction_request || 'Inconsistência cadastral ou documentos pendentes de validação no Conselho Regional (CRECI).'

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="mb-8">
        <Link to="/">
          <LogoWordmark size="md" dark />
        </Link>
      </div>

      <div className="bg-white text-navy-900 rounded-3xl p-8 sm:p-10 max-w-xl w-full shadow-2xl border border-warm-200">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-200">
          <AlertTriangle size={34} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-center text-navy-900 mb-2">
          {isRejected ? 'Cadastro Não Aprovado' : 'Acesso Suspenso'}
        </h1>
        <p className="text-warm-600 text-center text-sm leading-relaxed mb-6">
          Prezado(a) <strong>{profile?.name || user?.email}</strong>, o acesso ao painel profissional da Viva Belle Imobiliária está indisponível para esta conta.
        </p>

        {/* Motivo informado pelo Administrador */}
        <div className="bg-red-50 rounded-2xl p-5 border border-red-200 mb-6">
          <p className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-1">
            Motivo da Decisão / Solicitação de Correção:
          </p>
          <p className="text-sm text-red-950 leading-relaxed font-medium">
            "{reason}"
          </p>
          {profile?.approved_at && (
            <p className="text-[11px] text-red-600 mt-2">
              Registrado em: {new Date(profile.approved_at).toLocaleDateString('pt-BR')} às {new Date(profile.approved_at).toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>

        <p className="text-xs text-warm-500 leading-relaxed text-center mb-8">
          Caso queira contestar esta decisão, reenviar cópias do CRECI atualizadas ou esclarecer eventuais divergências, entre em contato com nossa diretoria comercial.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/5512999990000?text=Ol%C3%A1!%20Meu%20cadastro%20de%20corretor%20(CRECI%20${encodeURIComponent(profile?.creci || '')})%20consta%20como%20${isRejected ? 'rejeitado' : 'suspenso'}.%20Gostaria%20de%20esclarecer.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1 justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <MessageCircle size={16} />
            Suporte via WhatsApp
          </a>

          <a
            href="mailto:diretoria@vivabelle.com.br"
            className="btn btn-secondary flex-1 justify-center gap-2 py-3"
          >
            <Mail size={16} />
            Enviar E-mail
          </a>
        </div>

        <div className="mt-8 text-center pt-4 border-t border-warm-100">
          <button
            onClick={handleLogout}
            className="text-warm-500 hover:text-navy-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={14} /> Sair desta conta
          </button>
        </div>
      </div>
    </div>
  )
}
