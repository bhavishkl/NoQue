import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching owner queues:', error)
      return res.status(500).json({ error: 'Error fetching owner queues' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}