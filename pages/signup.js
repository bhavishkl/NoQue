import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (authError) throw authError
  
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: authData.user.id, name: '', bio: '' })
  
        if (profileError) throw profileError
      }
  
      toast.success('Sign up successful! Please check your email to confirm your account.')
      router.push('/user/home')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>Sign Up - QueueMaster</title>
        <meta name="description" content="Sign up for QueueMaster" />
      </Head>

      <main>
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
            <h2 className="mb-6 text-2xl font-bold text-center">Sign Up</h2>
            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                </button>
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Sign Up
              </button>
            </form>
          </div>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}