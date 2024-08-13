import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { FiEdit2, FiSave, FiClock, FiCheckCircle, FiXCircle, FiUser, FiMail, FiInfo } from 'react-icons/fi'
import Image from 'next/image'
import { useAuth } from '../../hooks/useAuth'
import ProfileSkeleton from '../../components/skeletons/ProfileSkeleton'
import { useApi } from '../../hooks/useApi'
import React from 'react'

const QueueHistoryItem = React.memo(({ entry }) => (
  <li className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out">
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
));

export default function Profile() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [queueHistory, setQueueHistory] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState('/favicon.ico')  // Set a default avatar
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState('')

  const { data: profileData, isLoading: profileLoading, isError: profileError, mutate: mutateProfile } = useApi(
    isAuthenticated ? '/api/user/profile' : null
  )

  useEffect(() => {
    if (profileData) {
      setName(profileData.name || '')
      setBio(profileData.bio || '')
      setQueueHistory(profileData.queue_history || [])
      setAvatar(profileData.avatar_url || '/favicon.ico')
      setEmail(profileData.email || '')
    }
  }, [profileData])

  useEffect(() => {
    if (profileError) {
      toast.error('Failed to fetch profile. Please try again.')
    }
  }, [profileError])

  async function updateProfile(e) {
    e.preventDefault()
    try {
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
      mutateProfile()
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleAvatarChange(event) {
    try {
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data, error } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (error) {
        throw error
      }

      const avatarUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', profileData.id)

      if (updateError) {
        throw updateError
      }

      setAvatar(avatarUrl)
      toast.success('Avatar updated successfully')
      mutateProfile()
    } catch (error) {
      toast.error('Error updating avatar')
    }
  }

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Profile</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
              <div className="text-center">
                <Image
                  src={avatar}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                {isEditing && (
                  <label htmlFor="avatar-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                    Change Avatar
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
            <div className="md:w-2/3 p-6">
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline-block mr-2" /> Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline-block mr-2" /> Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    <FiInfo className="inline-block mr-2" /> Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      isEditing ? 'bg-white' : 'bg-gray-100'
                    }`}
                  />
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <button
                      type="submit"
                      className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiSave className="mr-2" /> Save Changes
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiEdit2 className="mr-2" /> Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Queue History</h2>
        {queueHistory.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {queueHistory.slice(0, 5).map((entry, index) => (
                <QueueHistoryItem key={index} entry={entry} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 bg-white shadow-md rounded-lg">
            <FiClock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">No recent queue history available.</p>
            <p className="mt-1 text-sm text-gray-500">Join a queue to see your history here.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}