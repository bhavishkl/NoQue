import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../redux/slices/authSlice'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const handleSignIn = async (e) => {
    e.preventDefault()
    const result = await dispatch(signIn({ email, password }))
    if (signIn.fulfilled.match(result)) {
      toast.success('Signed in successfully')
      router.push('/user/home')
    } else {
      toast.error(result.payload || 'Failed to sign in')
    }
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Sign In</h2>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              required
              disabled={loading}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>
            <button 
              type="submit" 
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-gray-700">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
