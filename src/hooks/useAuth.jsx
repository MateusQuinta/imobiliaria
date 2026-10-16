import { useSupabaseAuth } from './useSupabaseAuth'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { user, loading, login, signup, logout } = useSupabaseAuth()

  const checkAdminStatus = async () => {
    if (!user) return false
    const { data, error } = await supabase
      .from('admin_users')
      .select('status, role')
      .eq('id', user.id)
      .single()
    
    if (error || !data) return false
    return data.status === 'active'
  }

  return {
    user,
    loading,
    isAdmin: checkAdminStatus(),
    login,
    signup,
    logout
  }
}
