import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { useSession } from '@supabase/auth-helpers-react'
import { FiClock, FiMapPin, FiUsers, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import QueueDetailsSkeleton from '../../components/skeletons/QueueDetailsSkeleton';

export default function QueueDetails() {
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [queuePosition, setQueuePosition] = useState(null)
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
      const [queueResponse, joinedResponse, positionResponse] = await Promise.all([
        fetch(`/api/queue/${id}`),
        fetch(`/api/queue/check-joined?queueId=${id}`),
        fetch(`/api/queue/position?queueId=${id}`)
      ])

      if (!queueResponse.ok || !joinedResponse.ok || !positionResponse.ok) {
        throw new Error('Failed to fetch queue details')
      }

      const [queueData, joinedData, positionData] = await Promise.all([
        queueResponse.json(),
        joinedResponse.json(),
        positionResponse.json()
      ])

      setQueue(queueData)
      setIsJoined(joinedData.isJoined)
      setQueuePosition(positionData.position)
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
      fetchQueueDetails()
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
        throw new Error('Failed to leave queue')
      }
      setIsJoined(false)
      setQueuePosition(null)
      toast.success('Successfully left the queue')
    } catch (error) {
      console.error('Error leaving queue:', error)
      toast.error('Failed to leave queue. Please try again.')
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
        <QueueDetailsSkeleton />
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
            <span>Estimated service time: {queue.estimated_service_time} minutes</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FiUsers className="mr-2" />
            <span>Capacity: {queue.max_capacity}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FiUsers className="mr-2" />
            <span>Current members: {queue.memberCount}</span>
          </div>
          {queue.userPosition ? (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
              <p className="font-bold">Your position in queue: {queue.userPosition}</p>
              <p>Estimated wait time: {queue.userEstimatedWaitTime} minutes</p>
            </div>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p>Estimated wait time: {queue.estimatedWaitTime} minutes</p>
            </div>
          )}
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
          <Link href={`/queue/queue-members?id=${id}`}>
            <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
              View Queue Members
            </button>
          </Link>
          <button
            onClick={fetchQueueDetails}
            className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200 flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh Queue Status
          </button>
        </div>
      </div>
    </Layout>
  )
}