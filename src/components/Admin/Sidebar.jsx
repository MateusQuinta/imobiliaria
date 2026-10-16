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
