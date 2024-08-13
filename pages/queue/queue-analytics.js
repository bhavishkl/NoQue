import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'

export default function QueueAnalytics() {
  const { session } = useAuth(true)
  const router = useRouter()
  const { id } = router.query
  const { data: analytics, isLoading, isError } = useApi(id && session ? `/api/queue/analytics/${id}` : null)

  if (!session) {
    return (
      <Layout>
        <div className="text-center">Not authenticated</div>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center">Loading queue analytics...</div>
      </Layout>
    )
  }

  if (isError) {
    toast.error('Failed to fetch queue analytics. Please try again.')
    return (
      <Layout>
        <div className="text-center">Error loading analytics</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Queue Analytics</h1>
        {analytics ? (
          <>
            <p className="text-gray-500">Total customers: {analytics.totalCustomers}</p>
            <p className="text-gray-500">Average wait time: {analytics.averageWaitTime} minutes</p>
            <p className="text-gray-500">Peak hours: {analytics.peakHours.join(', ')}</p>
          </>
        ) : (
          <p className="text-gray-500">No analytics data available</p>
        )}
      </div>
    </Layout>
  )
}