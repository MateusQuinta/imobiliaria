import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Clock, ShieldCheck, CheckCircle2, RefreshCw, LogOut, MessageCircle } from 'lucide-react'
import { LogoWordmark } from '../../components/Logo'
import toast from 'react-hot-toast'

export default function CadastroEmAnalisePage() {
  const { user, profile, isApproved, isSuspended, logout, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isApproved) {
      toast.success('Parabéns! Seu cadastro foi aprovado.')
      navigate('/admin/dashboard')
    } else if (isSuspended) {
      navigate('/conta-suspensa')
    }
  }, [isApproved, isSuspended, navigate])

  const handleRefresh = async () => {
    setChecking(true)
    try {
      const updated = await refreshProfile()
      if (updated && (updated.status === 'active' || updated.status === 'approved')) {
        toast.success('Seu cadastro foi aprovado! Redirecionando...')
        navigate('/admin/dashboard')
      } else {
        toast('Seu cadastro ainda está em fase de análise.')
      }
    } catch (err) {
      toast.error('Erro ao verificar status.')
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="mb-8">
        <Link to="/">
          <LogoWordmark size="md" dark />
        </Link>
      </div>

      <div className="bg-white text-navy-900 rounded-3xl p-8 sm:p-10 max-w-xl w-full shadow-2xl border border-warm-200">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-200">
          <Clock size={34} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-center text-navy-900 mb-2">
          Cadastro em Análise
        </h1>
        <p className="text-warm-600 text-center text-sm leading-relaxed mb-8">
          Olá, <strong>{profile?.name || user?.email}</strong>. Recebemos seus dados profissionais e sua solicitação de credenciamento na <strong>Viva Belle Imobiliária</strong>.
        </p>

        {/* Timeline do processo */}
        <div className="bg-warm-50 rounded-2xl p-5 border border-warm-200 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-navy-900">1. Submissão dos dados cadastrais</p>
              <p className="text-xs text-warm-500">Documentos e informações recebidos com sucesso.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700">2. Verificação de CRECI e Conformidade</p>
              <p className="text-xs text-warm-500">
                Conferência no CRECI-{profile?.creci_uf || 'SP'} ({profile?.creci || 'Em análise'}) e checagem de conformidade imobiliária.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-50">
            <ShieldCheck size={20} className="text-warm-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warm-700">3. Liberação do Painel do Corretor</p>
              <p className="text-xs text-warm-500">Acesso ao CRM, gestão de imóveis e atendimento de leads.</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-navy-50 rounded-xl text-xs text-navy-800 leading-relaxed mb-8 border border-navy-100">
          <strong>Tempo médio de resposta:</strong> Nossa equipe administrativa revisa as credenciais no Conselho Regional em até 24 horas úteis. Assim que aprovado, o painel será liberado e você receberá uma confirmação.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="btn btn-primary flex-1 justify-center gap-2 py-3"
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Verificando...' : 'Atualizar Status'}
          </button>

          <a
            href="https://wa.me/5512999990000?text=Ol%C3%A1!%20Enviei%20meu%20cadastro%20de%20corretor%20na%20Viva%20Belle%20e%20gostaria%20de%20saber%20o%20status."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary flex-1 justify-center gap-2 py-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
          >
            <MessageCircle size={16} className="text-emerald-600" />
            Falar com a Diretoria
          </a>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="text-warm-500 hover:text-navy-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
