import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  LayoutDashboard, 
  Building2, 
  Kanban, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Users, 
  Sliders, 
  FileText, 
  LogOut, 
  ExternalLink,
  ShieldAlert,
  User
} from 'lucide-react'
import { LogoWordmark } from '../Logo'

export default function Sidebar({ onLogout }) {
  const location = useLocation()
  const { profile, isAdmin } = useAuth()

  // Itens para o Corretor
  const brokerNav = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/properties', icon: Building2, label: 'Meus Imóveis' },
    { to: '/admin/leads', icon: Kanban, label: 'Funil de Leads' },
    { to: '/admin/visits', icon: Calendar, label: 'Agenda de Visitas' },
    { to: '/admin/commissions', icon: DollarSign, label: 'Minhas Comissões' },
    { to: '/admin/profile', icon: User, label: 'Meu Perfil' },
  ]

  // Itens adicionais para o Admin / Dono
  const adminNav = [
    { to: '/admin/approvals', icon: UserCheck, label: 'Fila de Aprovações', badge: true },
    { to: '/admin/brokers', icon: Users, label: 'Gestão de Corretores' },
    { to: '/admin/settings', icon: Sliders, label: 'Configurações' },
    { to: '/admin/audit', icon: FileText, label: 'Auditoria & Relatórios' },
  ]

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-navy-950 text-white min-h-screen flex flex-col justify-between border-r border-navy-900 shadow-xl">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" target="_blank" title="Ver site público" className="block">
            <LogoWordmark size="sm" dark />
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isAdmin ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {isAdmin ? 'Diretoria / Admin' : 'Corretor Parceiro'}
            </span>
            <Link 
              to="/" 
              target="_blank" 
              className="text-white/40 hover:text-white transition"
              title="Abrir site público em nova aba"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Profile snippet */}
        <div className="p-4 mx-3 my-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80'}
            alt={profile?.name || 'Usuário'}
            className="w-10 h-10 rounded-full object-cover border border-gold-500/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{profile?.name || 'Corretor'}</p>
            <p className="text-[11px] text-white/50 truncate">
              CRECI: {profile?.creci || 'Em análise'}
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="px-3 py-2 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Menu do Profissional
          </p>
          {brokerNav.map(item => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gold-500 text-white shadow-md'
                    : 'text-white/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-gold-400'} />
                {item.label}
              </Link>
            )
          })}

          {isAdmin && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-400/80">
                  Gestão & Diretoria
                </p>
              </div>
              {adminNav.map(item => {
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'text-white/70 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={active ? 'text-white' : 'text-gold-400'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </div>

      {/* Logout footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut size={16} />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  )
}
