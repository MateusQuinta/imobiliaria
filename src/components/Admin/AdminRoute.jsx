import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function AdminRoute({ children, adminOnly = false }) {
  const { user, profile, loading, isAdmin, isApproved, isPending, isSuspended } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    if (!user) {
      toast.error('Faça login para acessar o painel')
      navigate('/admin/login')
      return
    }

    // Se é admin_users e tem status
    if (profile) {
      if (profile.status === 'pending') {
        navigate('/cadastro-em-analise')
        return
      }

      if (profile.status === 'rejected' || profile.status === 'suspended') {
        navigate('/conta-suspensa')
        return
      }

      if (adminOnly && profile.role !== 'admin') {
        toast.error('Acesso restrito apenas para a diretoria/administração')
        navigate('/admin/dashboard')
        return
      }
    }
  }, [user, profile, loading, adminOnly, navigate])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-warm-50 text-navy-900 gap-4">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-warm-600">Carregando painel de acesso...</p>
      </div>
    )
  }

  if (!user) return null

  // Enquanto o perfil estiver pendente ou suspenso, não renderiza as rotas privadas do painel
  if (profile && (profile.status === 'pending' || profile.status === 'rejected' || profile.status === 'suspended')) {
    return null
  }

  return children
}
