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
      const { data: queueData, error: queueError } = await supabase
        .from('queues')
        .select('*')
        .eq('id', id)
        .single()

      if (queueError) throw queueError

      const { count: memberCount } = await supabase
        .from('queue_members')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', id)

      queueData.memberCount = memberCount

      // Calculate estimated wait time for non-queue members
      queueData.estimatedWaitTime = memberCount * queueData.estimated_service_time

      // Check if the user is in the queue and calculate their position
      const { data: userPosition, error: positionError } = await supabase
        .from('queue_members')
        .select('*')
        .eq('queue_id', id)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })

      if (!positionError && userPosition.length > 0) {
        const { count: position } = await supabase
          .from('queue_members')
          .select('*', { count: 'exact' })
          .eq('queue_id', id)
          .lte('created_at', userPosition[0].created_at)

        queueData.userPosition = position
        queueData.userEstimatedWaitTime = position * queueData.estimated_service_time
      }

      return res.status(200).json(queueData)
    } catch (error) {
      console.error('Error fetching queue:', error)
      return res.status(500).json({ error: 'Error fetching queue' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}