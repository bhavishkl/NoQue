import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { queueId } = req.query

  if (!queueId) {
    return res.status(400).json({ error: 'Queue ID is required' })
  }

  try {
    const { data, error } = await supabase.rpc('delete_queue_with_members', { p_queue_id: queueId })

    if (error) {
      throw error
    }

    return res.status(200).json({ message: 'Queue and related members deleted successfully' })
  } catch (error) {
    console.error('Error deleting queue:', error)
    return res.status(500).json({ error: 'An error occurred while deleting the queue' })
  }
}