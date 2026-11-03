/**
 * useSupabaseAuth — Autenticação Híbrida
 * 
 * Tenta usar Supabase primeiro. Se o Supabase não estiver acessível
 * (projeto pausado, sem internet, etc.), usa autenticação local para
 * que o painel funcione normalmente em desenvolvimento.
 *
 * Credenciais de acesso em modo local:
 *   Admin:    admin@vivabelle.com.br   / Admin123!
 *   Corretor: corretor@vivabelle.com.br / Corretor123!
 */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { 
  localAuthLogin, 
  localAuthGetSession, 
  localAuthLogout 
} from '../lib/localAuth'

const AuthContext = createContext(null)

// Testa se o Supabase está acessível
async function checkSupabaseAvailable() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url || url.includes('mock')) return false
    await fetch(`${url}/rest/v1/`, {
      signal: controller.signal,
      headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' }
    })
    clearTimeout(timeout)
    return true
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [useLocalMode, setUseLocalMode] = useState(false)
  const checkedRef = useRef(false)

  // Busca perfil do Supabase
  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) { setProfile(null); return null }
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (!error && data) { setProfile(data); return data }

      if (currentUser.email) {
        const { data: byEmail } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', currentUser.email)
          .maybeSingle()
        if (byEmail) { setProfile(byEmail); return byEmail }
      }
      setProfile(null); return null
    } catch {
      setProfile(null); return null
    }
  }, [])

  // Inicialização: verifica Supabase ou usa sessão local
  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    async function init() {
      const supabaseOk = await checkSupabaseAvailable()

      if (supabaseOk) {
        // Modo Supabase
        setUseLocalMode(false)
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser)
        }
        setLoading(false)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            const u = session?.user ?? null
            setUser(u)
            if (u) await fetchProfile(u)
            else setProfile(null)
            setLoading(false)
          }
        )
        return () => subscription.unsubscribe()
      } else {
        // Modo Local
        console.info('[Auth] Supabase indisponível — usando modo local de desenvolvimento.')
        setUseLocalMode(true)
        const localSession = localAuthGetSession()
        if (localSession) {
          setUser({ id: localSession.id, email: localSession.email })
          setProfile(localSession)
        }
        setLoading(false)
      }
    }

    init()
  }, [fetchProfile])

  const login = async (email, password) => {
    if (useLocalMode) {
      const profile = localAuthLogin(email, password) // lança erro se inválido
      setUser({ id: profile.id, email: profile.email })
      setProfile(profile)
      return { user: profile }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.user) await fetchProfile(data.user)
    return data
  }

  const signup = async (email, password, metadata) => {
    if (useLocalMode) {
      throw new Error('Cadastro desabilitado em modo local. Configure o Supabase para cadastrar novos usuários.')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    if (useLocalMode) {
      localAuthLogout()
    } else {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (useLocalMode) {
      const local = localAuthGetSession()
      if (local) setProfile(local)
      return local
    }
    if (user) return await fetchProfile(user)
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
      isLocalMode: useLocalMode,
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
