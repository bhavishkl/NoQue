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
      const { data, error } = await supabase
        .from('queue_members')
        .insert({ user_id: session.user.id, queue_id: queueId })
        .select()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return res.status(400).json({ error: 'Already joined this queue' })
        }
        throw error
      }

      // Increment the member_count in the queues table
      const { data: updatedQueue, error: updateError } = await supabase.rpc('increment_queue_member_count', {
        queue_id: queueId
      })

      if (updateError) throw updateError

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error joining queue:', error)
      return res.status(500).json({ error: 'Error joining queue' })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}