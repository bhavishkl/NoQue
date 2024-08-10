import { useState, useEffect } from 'react'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

export default function Queues() {
  const { session, isLoading } = useAuth(true)
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchQueues()
    }
  }, [session])

  async function fetchQueues() {
    try {
      setLoading(true)
      const response = await fetch('/api/queue/queues')
      if (!response.ok) {
        throw new Error('Failed to fetch queues')
      }
      const data = await response.json()
      setQueues(data)
    } catch (error) {
      console.error('Error fetching queues:', error)
      toast.error('Failed to fetch queues. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <Layout>
        <div className="text-center">Not authenticated</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Available Queues</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading queues...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queues.map((queue) => (
              <div key={queue.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                <h2 className="text-xl font-semibold mb-4">{queue.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="mr-2" />
                  <span>{queue.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiClock className="mr-2" />
                  <span>Estimated wait: {queue.estimated_service_time} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiUsers className="mr-2" />
                  <span>Capacity: {queue.max_capacity}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FiUsers className="mr-2" />
                  <span>Current members: {queue.member_count}</span>
                </div>
                <Link href={`/queue/${queue.id}`}>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    View Queue
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}