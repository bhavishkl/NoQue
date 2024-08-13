import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    const { queueId } = req.query

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles:user_id (name)
        `)
        .eq('queue_id', queueId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return res.status(500).json({ error: 'Error fetching reviews' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}