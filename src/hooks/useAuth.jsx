import { useSupabaseAuth } from './useSupabaseAuth'

export function useAuth() {
  const auth = useSupabaseAuth()
  return auth
}
