import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import storeHistory from './store-history'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'PUT') {
    const { memberId, queueId, status } = req.body

    if (!memberId || !queueId || !status) {
      return res.status(400).json({ error: 'Missing memberId, queueId, or status' })
    }

    try {
      // Fetch the most recent queue member entry
      const { data: memberData, error: memberError } = await supabase
        .from('queue_members')
        .select('*')
        .eq('queue_id', queueId)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (memberError) throw memberError

      if (!memberData) {
        return res.status(404).json({ error: 'Member not found in the queue' })
      }

      // Remove the member from the queue
      const { error: deleteError } = await supabase
        .from('queue_members')
        .delete()
        .eq('id', memberData.id)

      if (deleteError) throw deleteError

      // Update queue information
      const { data: updatedQueue, error: queueError } = await supabase
        .from('queues')
        .select('member_count, estimated_service_time')
        .eq('id', queueId)
        .single()

      if (queueError) throw queueError

      const newMemberCount = Math.max(0, updatedQueue.member_count - 1)
      const newEstimatedWaitTime = newMemberCount > 0 ? newMemberCount * updatedQueue.estimated_service_time : 0

      const { error: finalUpdateError } = await supabase
        .from('queues')
        .update({ 
          member_count: newMemberCount,
          total_estimated_wait_time: newEstimatedWaitTime
        })
        .eq('id', queueId)

      if (finalUpdateError) throw finalUpdateError

      // Fetch the joined_at time
      const { data: joinedData, error: joinedError } = await supabase
        .from('queue_member_history')
        .select('joined_at')
        .eq('queue_id', queueId)
        .eq('user_id', session.user.id)
        .is('served_at', null)
        .order('joined_at', { ascending: false })
        .limit(1)
        .single()

      if (joinedError) throw joinedError

      // Calculate wait time
      const waitTime = status === 'served' ? 
        Math.round((new Date() - new Date(joinedData.joined_at)) / 60000) : null

      // Update queue_member_history
      const { error: historyError } = await supabase
        .from('queue_member_history')
        .update({ 
          served_at: status === 'served' ? new Date().toISOString() : null,
          status: status,
          wait_time: waitTime
        })
        .eq('queue_id', queueId)
        .eq('user_id', session.user.id)
        .is('served_at', null)
        .order('joined_at', { ascending: false })
        .limit(1)

      if (historyError) throw historyError

      return res.status(200).json({ message: 'Member status updated and removed from queue' })
    } catch (error) {
      console.error('Error updating member status:', error)
      return res.status(500).json({ error: 'Error updating member status', details: error.message })
    }
  }

  res.setHeader('Allow', ['PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}