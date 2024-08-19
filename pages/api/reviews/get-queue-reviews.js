import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    const { queueId, page = 1 } = req.query
    const limit = 10 // Number of reviews per page

    try {
      const { data, error, count } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles:user_id (name)
        `, { count: 'exact' })
        .eq('queue_id', queueId)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      const hasMore = count > page * limit

      return res.status(200).json({ reviews: data, hasMore })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return res.status(500).json({ error: 'Error fetching reviews' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}