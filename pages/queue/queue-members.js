import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { FiUsers, FiClock, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export default function QueueMembers() {
  const { session, isLoading } = useAuth(true)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [queueInfo, setQueueInfo] = useState(null)
  const router = useRouter()
  const { id: queueId } = router.query

  useEffect(() => {
    if (queueId && session) {
      fetchQueueMembers()
      fetchQueueInfo()
    }
  }, [queueId, session])

  async function fetchQueueMembers() {
    try {
      setLoading(true)
      const response = await fetch(`/api/queue/members?queueId=${queueId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch queue members')
      }
      const data = await response.json()
      setMembers(data.members)
    } catch (error) {
      console.error('Error fetching queue members:', error)
      toast.error('Failed to fetch queue members. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchQueueInfo() {
    try {
      const response = await fetch(`/api/queue/${queueId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch queue information')
      }
      const data = await response.json()
      setQueueInfo(data)
    } catch (error) {
      console.error('Error fetching queue information:', error)
      toast.error('Failed to fetch queue information. Please try again.')
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
      <div className="max-w-4xl mx-auto mt-8 px-4">
        {queueInfo && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{queueInfo.name}</h1>
            <p className="text-gray-600 mb-4">{queueInfo.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <FiUsers className="mr-2" />
                <span>Capacity: {queueInfo.max_capacity}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-2" />
                <span>Estimated wait: {queueInfo.estimated_service_time} minutes</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Queue Members</h2>
          <button
            onClick={fetchQueueMembers}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading queue members...</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(member.joinTime).toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && members.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No members in the queue yet.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}