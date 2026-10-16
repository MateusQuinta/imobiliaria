import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Admin/Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-warm-50">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
