import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const supabase = createServerSupabaseClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { queueId } = req.query

    try {
      // Call the updated stored procedure with the correct parameter name
      const { data, error } = await supabase.rpc('delete_queue_with_history', { p_queue_id: queueId })

      if (error) throw error

      return res.status(200).json({ message: 'Queue and related history deleted successfully' })
    } catch (error) {
      console.error('Error deleting queue:', error)
      return res.status(500).json({ error: 'Error deleting queue', details: error.message })
    }
  }

  res.setHeader('Allow', ['DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}