import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { FiEdit2, FiSave, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import Image from 'next/image'
import { useAuth } from '../../hooks/useAuth'

export default function Profile() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [queueHistory, setQueueHistory] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const { session, isLoading } = useAuth(true)
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  async function fetchProfile() {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }
      const data = await response.json()
      setName(data.name || '')
      setBio(data.bio || '')
      setQueueHistory(data.queue_history || [])
      setAvatar(data.avatar_url || '/favicon.ico')
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error(error.message || 'Error fetching profile')
    } finally {
      setLoading(false)
    }
  }
  
  async function updateProfile(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${session.user.id}/${fileName}`

    try {
      setLoading(true)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (urlError) {
        throw urlError
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', session.user.id)

      if (updateError) {
        throw updateError
      }

      setAvatar(urlData.publicUrl)
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Error updating avatar')
    } finally {
      setLoading(false)
    }
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            {isEditing ? <FiSave className="mr-2" /> : <FiEdit2 className="mr-2" />}
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <div className="relative w-48 h-48 mx-auto">
              <Image
                src={avatar || '/default-avatar.png'}
                alt="Profile Avatar"
                width={192}
                height={192}
                className="rounded-full object-cover"
              />
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                  <FiEdit2 />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div className="md:w-2/3">
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={session.user.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100'
                  }`}
                />
              </div>
              {isEditing && (
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Recent Queue History</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : queueHistory.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {queueHistory.slice(0, 5).map((entry, index) => (
                <li key={index} className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {entry.status === 'completed' ? (
                          <FiCheckCircle className="h-6 w-6 text-green-500" />
                        ) : entry.status === 'cancelled' ? (
                          <FiXCircle className="h-6 w-6 text-red-500" />
                        ) : (
                          <FiClock className="h-6 w-6 text-yellow-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{entry.queue_name}</div>
                        <div className="text-sm text-gray-500">
                          Joined: {new Date(entry.join_time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-900">
                        Exit: {new Date(entry.exit_time).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Status: <span className="capitalize">{entry.status}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent queue history available.</p>
        )}
      </div>
    </Layout>
  )
}