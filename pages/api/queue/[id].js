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
  .select('*, categories(id, name), average_rating, queue_uid, is_paused, service_start_time')
  .eq('id', id)
  .single()
  
if (queueError) throw queueError

      const { count: memberCount } = await supabase
        .from('queue_members')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', id)

        queueData.memberCount = memberCount

        // Calculate estimated wait time for non-queue members
        const newEstimatedWaitTime = memberCount > 0 ? memberCount * queueData.estimated_service_time : 0
        
        // Update the total_estimated_wait_time in the database only if it has changed
        if (newEstimatedWaitTime !== queueData.total_estimated_wait_time) {
          const { error: updateError } = await supabase
            .from('queues')
            .update({ total_estimated_wait_time: newEstimatedWaitTime })
            .eq('id', id)
        
          if (updateError) {
            console.error('Error updating total_estimated_wait_time:', updateError)
          } else {
            queueData.total_estimated_wait_time = newEstimatedWaitTime
          }
        }
        
        queueData.estimatedWaitTime = newEstimatedWaitTime

        // Check if the user is in the queue and calculate their position
        const { data: userPosition, error: positionError } = await supabase
          .from('queue_members')
          .select('*, created_at, expected_at')
          .eq('queue_id', id)
          .eq('user_id', session.user.id)
          .single()
        
        if (!positionError && userPosition) {
          const { count: position, data: previousMember } = await supabase
            .from('queue_members')
            .select('*', { count: 'exact' })
            .eq('queue_id', id)
            .lte('created_at', userPosition.created_at)
            .order('created_at', { ascending: false })
            .limit(2)
        
          queueData.userPosition = position
          queueData.userEstimatedWaitTime = position > 1 ? (position - 1) * queueData.estimated_service_time : 0
          queueData.isJoined = true
          queueData.expectedAt = userPosition.expected_at
        
          // Convert previous user's join time to UTC
          const prevUserJoinTime = previousMember.length > 1 ? new Date(previousMember[1].created_at) : null
          queueData.previousMemberJoinTimeUTC = prevUserJoinTime ? prevUserJoinTime.toUTCString() : null
        
          // Calculate user's expected time in UTC
          const now = new Date()
          const serviceStartTime = queueData.service_start_time 
            ? new Date(`${now.toUTCString().split(' ').slice(0, 4).join(' ')} ${queueData.service_start_time}Z`) 
            : now
          const timeUntilServiceStart = Math.max(0, serviceStartTime - now)
          const userExpectedTime = new Date(now.getTime() + timeUntilServiceStart + queueData.userEstimatedWaitTime * 60000)
          queueData.userExpectedTime = userExpectedTime.toUTCString()
        } else {
          queueData.isJoined = false
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