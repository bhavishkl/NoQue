import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'POST') {
    const { queueId } = req.body

    try {
      const { error } = await supabase
        .from('queue_members')
        .delete()
        .match({ user_id: session.user.id, queue_id: queueId })

      if (error) throw error

      // Decrement the member_count in the queues table
      const { data: updatedQueue, error: updateError } = await supabase.rpc('decrement_queue_member_count', {
        queue_id: queueId
      })

      if (updateError) throw updateError

      return res.status(200).json({ message: 'Successfully left the queue' })
    } catch (error) {
      console.error('Error leaving queue:', error)
      return res.status(500).json({ error: 'Error leaving queue' })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}