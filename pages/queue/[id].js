import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Layout from '../../components/layout'
import { FiClock, FiMapPin, FiUsers, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Link from 'next/link'
import QueueDetailsSkeleton from '../../components/skeletons/QueueDetailsSkeleton'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import ReviewList from '../../components/ReviewList'

const ReviewForm = dynamic(() => import('../../components/ReviewForm'), {
  loading: () => <p className="text-center text-gray-500">Loading review form...</p>,
})

export default function QueueDetails() {
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const router = useRouter()
  const { id } = router.query
  const { data: queue, isLoading: queueLoading, isError, mutate } = useApi(isAuthenticated ? `/api/queue/${id}` : null)

  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch queue details. Please try again.')
    }
  }, [isError])

  const handleJoinQueue = useCallback(async (callback) => {
    try {
      setIsJoining(true)
      const response = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id }),
      })
      if (!response.ok) {
        throw new Error('Failed to join queue')
      }
      callback(null, 'Successfully joined the queue')
      mutate()
    } catch (error) {
      console.error('Error joining queue:', error)
      callback(error, null)
    } finally {
      setIsJoining(false)
    }
  }, [id, mutate])

  const handleLeaveQueue = useCallback(async (callback) => {
    try {
      setIsLeaving(true)
      const response = await fetch('/api/queue/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id }),
      })
      if (!response.ok) {
        throw new Error('Failed to leave queue')
      }
      callback(null, 'Successfully left the queue')
      mutate()
    } catch (error) {
      console.error('Error leaving queue:', error)
      callback(error, null)
    } finally {
      setIsLeaving(false)
    }
  }, [id, mutate])

  if (authLoading || queueLoading) {
    return (
      <Layout>
        <QueueDetailsSkeleton />
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }

  if (!queue) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="text-5xl text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Queue not found</h2>
          <p className="mt-2 text-gray-500">The queue you're looking for doesn't exist or has been removed.</p>
          <Link href="/user/queues" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Browse Queues
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{queue.name}</h1>
            <p className="text-gray-600">{queue.description}</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <FiMapPin className="mr-2 text-blue-500" />
              <span><strong>{queue.location}</strong></span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiClock className="mr-2 text-green-500" />
              <span>Est. service time: <strong>{queue.estimated_service_time} min</strong></span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiUsers className="mr-2 text-purple-500" />
              <span>Capacity: <strong>{queue.max_capacity}</strong></span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiUsers className="mr-2 text-indigo-500" />
              <span>Current members: <strong>{queue.memberCount}</strong></span>
            </div>
            <div className="flex items-center text-gray-700 col-span-2">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="font-semibold"><strong>{queue.average_rating ? queue.average_rating.toFixed(1) : 'N/A'}</strong></span>
              <span className="ml-1 text-sm text-gray-500">(<strong>{queue.reviewCount || 0}</strong> reviews)</span>
            </div>
          </div>
          {queue.userPosition ? (
            <div className="bg-blue-100 p-4">
              <p className="font-bold text-blue-800">Your position in queue: <strong>{queue.userPosition}</strong></p>
              <p className="text-blue-700">Estimated wait time: <strong>{queue.userEstimatedWaitTime} minutes</strong></p>
            </div>
          ) : (
            <div className="bg-yellow-100 p-4">
              <p className="text-yellow-800">Estimated wait time: <strong>{queue.estimatedWaitTime} minutes</strong></p>
            </div>
          )}
          <div className="p-6 flex flex-col sm:flex-row gap-4">
            {queue.isJoined ? (
              <button
                onClick={() => handleLeaveQueue((error, message) => {
                  if (error) {
                    toast.error('Failed to leave queue. Please try again.')
                  } else {
                    toast.success(message)
                  }
                })}
                disabled={isLeaving}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLeaving ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Leaving Queue...
                  </>
                ) : (
                  'Leave Queue'
                )}
              </button>
            ) : (
              <button
                onClick={() => handleJoinQueue((error, message) => {
                  if (error) {
                    toast.error('Failed to join queue. Please try again.')
                  } else {
                    toast.success(message)
                  }
                })}
                disabled={isJoining}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isJoining ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Joining Queue...
                  </>
                ) : (
                  'Join Queue'
                )}
              </button>
            )}
            <Link href={`/queue/queue-members?id=${id}`} className="flex-1">
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                View Queue Members
              </button>
            </Link>
          </div>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => mutate()}
              disabled={queueLoading}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${queueLoading ? 'animate-spin' : ''}`} />
              {queueLoading ? 'Refreshing...' : 'Refresh Queue Status'}
            </button>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          
          <div className="p-6">
            <ReviewForm queueId={queue.id} onReviewSubmitted={() => setRefreshKey(Date.now())} />
          </div>
          <div className="border-t border-gray-200">
            <ReviewList queueId={queue.id} key={refreshKey} />
          </div>
        </div>
      </div>
    </Layout>
  )
}