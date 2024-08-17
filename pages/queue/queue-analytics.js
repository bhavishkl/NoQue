import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { Bar, Line } from 'react-chartjs-2'
import { FiUsers, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

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

  const waitTimeData = {
    labels: analytics?.waitTimeByHour?.map(item => item.hour) || [],
    datasets: [
      {
        label: 'Average Wait Time (minutes)',
        data: analytics?.waitTimeByHour?.map(item => item.averageWaitTime) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const customerFlowData = {
    labels: analytics?.customerFlowByDay?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Number of Customers',
        data: analytics?.customerFlowByDay?.map(item => item.customerCount) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Queue Analytics</h1>
        
        {analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <FiUsers className="mr-2" /> Total Customers
                </h2>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalCustomers || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <FiClock className="mr-2" /> Average Wait Time
                </h2>
                <p className="text-3xl font-bold text-green-600">{analytics.averageWaitTime || 0} minutes</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <FiTrendingUp className="mr-2" /> Peak Hours
                </h2>
                <p className="text-lg font-medium text-purple-600">{analytics.peakHours?.join(', ') || 'No data'}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <FiCalendar className="mr-2" /> Busiest Day
                </h2>
                <p className="text-lg font-medium text-yellow-600">{analytics.busiestDay || 'No data'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Average Wait Time by Hour</h2>
                <Line data={waitTimeData} options={{ responsive: true }} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Customer Flow by Day</h2>
                <Bar data={customerFlowData} options={{ responsive: true }} />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Additional Insights</h2>
              <ul className="space-y-2">
                <li><strong>Customer Satisfaction Rate:</strong> {analytics.customerSatisfactionRate || 0}%</li>
                <li><strong>Average Service Time:</strong> {analytics.averageServiceTime || 0} minutes</li>
                <li><strong>Queue Efficiency Rate:</strong> {analytics.queueEfficiencyRate || 0}%</li>
                <li><strong>Most Common Feedback:</strong> {analytics.mostCommonFeedback || 'No data'}</li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No analytics data available</p>
        )}
      </div>
    </Layout>
  )
}