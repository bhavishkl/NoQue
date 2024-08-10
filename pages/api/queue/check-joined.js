import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { queueId } = req.query

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('queue_members')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('queue_id', queueId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return res.status(200).json({ isJoined: !!data })
    } catch (error) {
      console.error('Error checking queue membership:', error)
      return res.status(500).json({ error: 'Error checking queue membership' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}