import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      // Fetch queue data
      const { data: queue, error: queueError } = await supabase
        .from('queues')
        .select('*')
        .eq('id', id)
        .single()

      if (queueError) throw queueError

      // Fetch historical queue data (e.g., last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const { data: historyData, error: historyError } = await supabase
        .from('queue_member_history')
        .select('*')
        .eq('queue_id', id)
        .gte('joined_at', thirtyDaysAgo)
        .order('joined_at', { ascending: true })

      if (historyError) throw historyError

      // Calculate analytics
      const totalCustomers = historyData.length
      const averageWaitTime = calculateAverageWaitTime(historyData)
      const peakHours = calculatePeakHours(historyData)
      const busiestDay = calculateBusiestDay(historyData)
      const waitTimeByHour = calculateWaitTimeByHour(historyData)
      const customerFlowByDay = calculateCustomerFlowByDay(historyData)
      const customerSatisfactionRate = await calculateCustomerSatisfactionRate(id, supabase)
      const queueEfficiencyRate = calculateQueueEfficiencyRate(historyData)

      const analytics = {
        totalCustomers,
        averageWaitTime,
        peakHours,
        busiestDay,
        waitTimeByHour,
        customerFlowByDay,
        customerSatisfactionRate,
        averageServiceTime: queue.estimated_service_time,
        queueEfficiencyRate,
      }

      res.status(200).json(analytics)
    } catch (error) {
      console.error('Error fetching queue analytics:', error)
      res.status(500).json({ error: 'An error occurred while fetching queue analytics' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

function calculateAverageWaitTime(historyData) {
  const servedCustomers = historyData.filter(member => member.status === 'served' && member.wait_time)
  if (servedCustomers.length === 0) return 0
  const totalWaitTime = servedCustomers.reduce((sum, member) => sum + member.wait_time, 0)
  return Math.round(totalWaitTime / servedCustomers.length)
}

function calculatePeakHours(historyData) {
  const hourCounts = {}
  historyData.forEach(member => {
    const hour = new Date(member.joined_at).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  const maxCount = Math.max(...Object.values(hourCounts))
  return Object.keys(hourCounts).filter(hour => hourCounts[hour] === maxCount).map(Number).sort((a, b) => a - b)
}

function calculateBusiestDay(historyData) {
  const dayCounts = {}
  historyData.forEach(member => {
    const day = new Date(member.joined_at).toLocaleDateString('en-US', { weekday: 'long' })
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })
  return Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b)
}

function calculateWaitTimeByHour(historyData) {
  const waitTimes = {}
  historyData.forEach(member => {
    if (member.status === 'served' && member.wait_time) {
      const hour = new Date(member.joined_at).getHours()
      if (!waitTimes[hour]) waitTimes[hour] = []
      waitTimes[hour].push(member.wait_time)
    }
  })
  return Object.entries(waitTimes).map(([hour, times]) => ({
    hour: parseInt(hour),
    averageWaitTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length)
  })).sort((a, b) => a.hour - b.hour)
}

function calculateCustomerFlowByDay(historyData) {
  const flowByDay = {}
  historyData.forEach(member => {
    const date = new Date(member.joined_at).toISOString().split('T')[0]
    flowByDay[date] = (flowByDay[date] || 0) + 1
  })
  return Object.entries(flowByDay).map(([date, customerCount]) => ({ date, customerCount }))
}

async function calculateCustomerSatisfactionRate(queueId, supabase) {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('queue_id', queueId)
  
  if (error) throw error
  if (reviews.length === 0) return 0

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((totalRating / (reviews.length * 5)) * 100)
}

function calculateQueueEfficiencyRate(historyData) {
  const servedCustomers = historyData.filter(member => member.status === 'served' && member.wait_time && member.service_time)
  if (servedCustomers.length === 0) return 100
  const totalWaitTime = servedCustomers.reduce((sum, member) => sum + member.wait_time, 0)
  const totalServiceTime = servedCustomers.reduce((sum, member) => sum + member.service_time, 0)
  return Math.round((totalServiceTime / (totalWaitTime + totalServiceTime)) * 100)
}