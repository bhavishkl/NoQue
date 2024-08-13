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
        // Call the store-history function directly
        await storeHistory(req, res, { memberId, queueId, status })

        // Decrement the member_count and update total_estimated_wait_time in the queues table
const { data: updatedQueue, error: updateError } = await supabase
.from('queues')
.select('member_count, estimated_service_time')
.eq('id', queueId)
.single()

if (updateError) throw updateError

const newMemberCount = updatedQueue.member_count - 1
const newEstimatedWaitTime = newMemberCount > 0 ? newMemberCount * updatedQueue.estimated_service_time : 0

const { error: updateQueueError } = await supabase
.from('queues')
.update({ 
  member_count: newMemberCount,
  total_estimated_wait_time: newEstimatedWaitTime
})
.eq('id', queueId)

if (updateQueueError) throw updateQueueError
        if (updateError) throw updateError
      
        return res.status(200).json({ message: 'Member status updated and removed from queue' })
      } catch (error) {
        console.error('Error updating member status:', error)
      return res.status(500).json({ error: 'Error updating member status', details: error.message })
    }
  }
}