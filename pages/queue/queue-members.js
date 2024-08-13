import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { FiUsers, FiClock, FiRefreshCw, FiMapPin } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import React, { useState } from 'react'

const QueueMemberItem = React.memo(({ member }) => (
  <tr className="hover:bg-gray-50 transition duration-150">
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
));

export default function QueueMembers() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const router = useRouter()
  const { id: queueId } = router.query
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, isLoading: membersLoading, isError: membersError, mutate: mutateMembers } = useApi(
    isAuthenticated && queueId ? `/api/queue/members?queueId=${queueId}` : null
  )

  const { data: queueInfo, isLoading: queueInfoLoading, isError: queueInfoError } = useApi(
    isAuthenticated && queueId ? `/api/queue/${queueId}` : null
  )

  const members = data?.members || []

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutateMembers()
    setIsRefreshing(false)
  }

  if (membersError || queueInfoError) {
    toast.error('Failed to fetch data. Please try again.')
  }

  if (authLoading || membersLoading || queueInfoLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        {queueInfo && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{queueInfo.name}</h1>
            <p className="text-gray-600 mb-6">{queueInfo.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <FiUsers className="mr-2 text-blue-500" />
                <span>Capacity: <strong>{queueInfo.max_capacity}</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-2 text-blue-500" />
                <span>Estimated wait: <strong>{queueInfo.estimated_service_time} minutes</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiMapPin className="mr-2 text-blue-500" />
                <span>Location: <strong>{queueInfo.location}</strong></span>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Queue Members</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <QueueMemberItem key={member.id} member={member} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-xl text-gray-600 mb-2">No members in the queue yet</p>
              <p className="text-gray-500">Members will appear here once they join the queue</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}