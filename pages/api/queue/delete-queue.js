import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'DELETE') {
    const { queueId } = req.query

    try {
      const { error } = await supabase
        .from('queues')
        .delete()
        .eq('id', queueId)
        .eq('owner_id', session.user.id)

      if (error) throw error

      return res.status(200).json({ message: 'Queue deleted successfully' })
    } catch (error) {
      console.error('Error deleting queue:', error)
      return res.status(500).json({ error: 'Error deleting queue' })
    }
  }

  res.setHeader('Allow', ['DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}