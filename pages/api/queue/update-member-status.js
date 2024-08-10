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

        // Decrement the member_count in the queues table
        const { data: updatedQueue, error: updateError } = await supabase.rpc('decrement_queue_member_count', {
          queue_id: queueId
        })

        if (updateError) throw updateError
      
        return res.status(200).json({ message: 'Member status updated and removed from queue' })
      } catch (error) {
        console.error('Error updating member status:', error)
      return res.status(500).json({ error: 'Error updating member status', details: error.message })
    }
  }
}