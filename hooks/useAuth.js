import { useState, useEffect } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

export function useAuth(requireAuth = false) {
  const [isLoading, setIsLoading] = useState(true)
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && requireAuth) {
        router.push('/signin')
      }
      setIsLoading(false)
    }

    checkSession()
  }, [supabase, router, requireAuth])

  return { isLoading, session }
}