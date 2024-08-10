import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'

export default function QueueAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const session = useSession()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id && session) {
      fetchQueueAnalytics()
    }
  }, [id, session])

  async function fetchQueueAnalytics() {
    try {
      setLoading(true)
      // Implement your analytics fetching logic here
      // For example:
      // const response = await fetch(`/api/queue/analytics/${id}`)
      // if (!response.ok) {
      //   throw new Error('Failed to fetch queue analytics')
      // }
      // const data = await response.json()
      // setAnalytics(data)

      // Placeholder data
      setAnalytics({
        totalCustomers: 100,
        averageWaitTime: 15,
        peakHours: ['2PM - 3PM', '5PM - 6PM'],
      })
    } catch (error) {
      console.error('Error fetching queue analytics:', error)
      toast.error('Failed to fetch queue analytics. Please try again.')
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading queue analytics...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Queue Analytics</h1>
        <p className="text-gray-500">Total customers: {analytics.totalCustomers}</p>
        <p className="text-gray-500">Average wait time: {analytics.averageWaitTime} minutes</p>
        <p className="text-gray-500">Peak hours: {analytics.peakHours.join(', ')}</p>
      </div>
    </Layout>
  )
}