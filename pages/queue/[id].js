import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/layout'
import { FiClock, FiMapPin, FiUsers, FiRefreshCw, FiAlertCircle, FiTag, FiHash, FiCopy } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Link from 'next/link'
import QueueDetailsSkeleton from '../../components/skeletons/QueueDetailsSkeleton'
import { useAuth } from '../../hooks/useAuth'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { fetchQueueDetails, joinQueue, leaveQueue } from '../../redux/slices/queueSlice'
import dynamic from 'next/dynamic'
import QueueErrorBoundary from '../../components/ErrorHandlers/QueueErrorBoundary'
import { formatDistanceToNow, parseISO } from 'date-fns'

const ReviewForm = dynamic(() => import('../../components/ReviewForm'), {
  loading: () => <p className="text-center text-gray-500">Loading review form...</p>,
})

const DynamicReviewList = dynamic(() => import('../../components/ReviewList'), {
  loading: () => <p className="text-center text-gray-500">Loading reviews...</p>,
  ssr: false
})

const Countdown = ({ expectedAt }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const expected = parseISO(expectedAt)
      if (now >= expected) {
        setTimeLeft('Time expired')
        clearInterval(timer)
      } else {
        const diff = expected.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expectedAt])

  return <span>{timeLeft}</span>
}

export default function QueueDetails() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const { currentQueue: queue, loading: queueLoading, error } = useSelector((state) => state.queue)
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchQueueDetails(id))
    }
  }, [isAuthenticated, id, dispatch])

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch queue details. Please try again.')
    }
  }, [error])

  useEffect(() => {
    if (!queue || !isAuthenticated) return

    const channel = supabase
      .channel(`queue_${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_members' }, () => {
        dispatch(fetchQueueDetails(id))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queue, id, isAuthenticated, supabase, dispatch])

  const handleJoinQueue = async () => {
    try {
      await dispatch(joinQueue(id)).unwrap()
      toast.success('Successfully joined the queue')
    } catch (error) {
      toast.error('Failed to join queue. Please try again.')
    }
  }

  const handleLeaveQueue = async () => {
    try {
      await dispatch(leaveQueue(id)).unwrap()
      toast.success('Successfully left the queue')
    } catch (error) {
      toast.error('Failed to leave queue. Please try again.')
    }
  }

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

  return (
    <Layout>
      <QueueErrorBoundary>
        {queue ? (
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
                <div className="flex items-center text-gray-700">
                  <FiTag className="mr-2 text-indigo-500" />
                  <span>Category: <strong>{queue.categories ? queue.categories.name : 'Uncategorized'}</strong></span>
                </div>
                <div className="flex items-center text-gray-700 col-span-2">
                  <FiHash className="mr-2 text-indigo-500" />
                  <span>Queue UID: </span>
                  <div className="relative ml-2">
                    <input
                      type="text"
                      value={queue.queue_uid || 'N/A'}
                      readOnly
                      className="border border-gray-300 rounded px-2 py-1 text-sm font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(queue.queue_uid);
                        toast.success('Queue UID copied to clipboard!');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
              </div>
              {queue.userPosition ? (
                <div className="bg-blue-100 p-4">
                  <p className="font-bold text-blue-800">Your position in queue: <strong>{queue.userPosition}</strong></p>
                  <p className="text-blue-700">Estimated wait time: <strong>{queue.userEstimatedWaitTime} minutes</strong></p>
                  {queue.expectedAt && (
                    <>
                      <p className="text-blue-700">Expected service time: <strong>{new Date(queue.expectedAt).toLocaleString()}</strong></p>
                      <p className="text-blue-700">Time until service: <strong><Countdown expectedAt={queue.expectedAt} /></strong></p>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-100 p-4">
                  <p className="text-yellow-800">Estimated wait time: <strong>{queue.estimatedWaitTime} minutes</strong></p>
                </div>
              )}
              <div className="p-6 flex flex-col sm:flex-row gap-4">
                {queue.isJoined ? (
                  <button
                    onClick={handleLeaveQueue}
                    disabled={queueLoading}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    Leave Queue
                  </button>
                ) : (
                  <button
                    onClick={handleJoinQueue}
                    disabled={queueLoading}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    Join Queue
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
                  onClick={() => dispatch(fetchQueueDetails(id))}
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
                <ReviewForm queueId={queue.id} onReviewSubmitted={() => dispatch(fetchQueueDetails(queue.id))} />
              </div>
              <div className="border-t border-gray-200">
                <DynamicReviewList queueId={queue.id} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <FiAlertCircle className="text-5xl text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Queue not found</h2>
            <p className="mt-2 text-gray-500">The queue you're looking for doesn't exist or has been removed.</p>
            <Link href="/user/queues" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
              Browse Queues
            </Link>
          </div>
        )}
      </QueueErrorBoundary>
    </Layout>
  )
}