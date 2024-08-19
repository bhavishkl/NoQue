import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'PUT') {
    const { queueId } = req.query

    try {
      const { data, error } = await supabase
        .from('queues')
        .update({ is_paused: true })
        .eq('id', queueId)
        .single()

      if (error) throw error

      return res.status(200).json({ message: 'Queue paused successfully' })
    } catch (error) {
      console.error('Error pausing queue:', error)
      return res.status(500).json({ error: 'Failed to pause queue' })
    }
  }

  res.setHeader('Allow', ['PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}