import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { useSession } from '@supabase/auth-helpers-react'
import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { handleClientError } from '../../utils/errorHandler'

export default function QueueDetails() {
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const session = useSession()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id && session) {
      fetchQueueDetails()
    }
  }, [id, session])

  async function fetchQueueDetails() {
    try {
      setLoading(true)
      const response = await fetch(`/api/queue/queue-details?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch queue details')
      }
      const data = await response.json()
      setQueue(data)
      // Check if the user is already in the queue
      const joinedResponse = await fetch(`/api/queue/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id }),
      })
      setIsJoined(joinedResponse.ok)
    } catch (error) {
      console.error('Error fetching queue details:', error)
      toast.error('Failed to fetch queue details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinQueue() {
    try {
      const response = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id }),
      })
      if (!response.ok) {
        throw new Error('Failed to join queue')
      }
      setIsJoined(true)
      toast.success('Successfully joined the queue')
    } catch (error) {
      console.error('Error joining queue:', error)
      toast.error('Failed to join queue. Please try again.')
    }
  }

  async function handleLeaveQueue() {
    try {
      const response = await fetch('/api/queue/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to leave queue')
      }
      setIsJoined(false)
      toast.success('Successfully left the queue')
    } catch (error) {
      handleClientError(error, 'Failed to leave queue. Please try again.')
    }
  }

  if (!session) {
    return (
      <Layout>
        <div className="text-center">Not authenticated</div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading queue details...</div>
      </Layout>
    )
  }

  if (!queue) {
    return (
      <Layout>
        <div className="text-center">Queue not found</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{queue.name}</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">{queue.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FiMapPin className="mr-2" />
            <span>{queue.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FiClock className="mr-2" />
            <span>Estimated wait: {queue.estimated_service_time} minutes</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FiUsers className="mr-2" />
            <span>Capacity: {queue.max_capacity}</span>
          </div>
          {isJoined ? (
            <button
              onClick={handleLeaveQueue}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
              Leave Queue
            </button>
          ) : (
            <button
              onClick={handleJoinQueue}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Join Queue
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}