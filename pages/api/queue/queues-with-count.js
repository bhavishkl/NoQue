import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    try {
      const { data: queues, error } = await supabase
        .from('queues')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const queuesWithCount = await Promise.all(queues.map(async (queue) => {
        const { count } = await supabase
          .from('queue_members')
          .select('*', { count: 'exact', head: true })
          .eq('queue_id', queue.id)

        return { ...queue, memberCount: count }
      }))

      return res.status(200).json(queuesWithCount)
    } catch (error) {
      console.error('Error fetching queues:', error)
      return res.status(500).json({ error: 'Error fetching queues' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}