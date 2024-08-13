import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { checkAuthState } from '../redux/slices/authSlice'

export function useAuth(requireAuth = false) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      router.push('/signin')
    }
  }, [loading, requireAuth, isAuthenticated, router])

  return { isLoading: loading, session: isAuthenticated ? user : null, isAuthenticated }
}