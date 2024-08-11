import { useState, useEffect } from 'react'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import { FiClock, FiMapPin, FiUsers, FiSearch } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import QueuesSkeleton from '../../components/skeletons/QueuesSkeleton';

export default function Queues() {
  const { session, isLoading } = useAuth(true)
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { search } = router.query

  useEffect(() => {
    if (session) {
      fetchQueues()
    }
  }, [session, search])

  const fetchQueues = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/queues${search ? `?search=${search}` : ''}`)
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredQueues = queues.filter((queue) =>
    queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    queue.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search queues..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <QueuesSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQueues.map((queue) => (
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