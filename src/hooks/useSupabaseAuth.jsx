import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null)
      return null
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (!error && data) {
        setProfile(data)
        return data
      }

      // Se não encontrou por ID, tenta por email como fallback
      if (currentUser.email) {
        const { data: dataEmail } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', currentUser.email)
          .maybeSingle()

        if (dataEmail) {
          setProfile(dataEmail)
          return dataEmail
        }
      }

      setProfile(null)
      return null
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    // 1. Pegar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // 2. Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.user) {
      await fetchProfile(data.user)
    }
    return data
  }

  const signup = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      return await fetchProfile(user)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      signup, 
      logout, 
      refreshProfile,
      isAdmin: profile?.role === 'admin',
      isApproved: profile?.status === 'active' || profile?.status === 'approved',
      isPending: profile?.status === 'pending',
      isSuspended: profile?.status === 'suspended' || profile?.status === 'rejected'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useSupabaseAuth must be used within AuthProvider')
  return context
}
