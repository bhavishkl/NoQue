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
      // First, check if the user is in the queue
      const { data: userInQueue, error: userCheckError } = await supabase
        .from('queue_members')
        .select('created_at')
        .eq('queue_id', queueId)
        .eq('user_id', session.user.id)
        .single()

      if (userCheckError) {
        if (userCheckError.code === 'PGRST116') {
          // User is not in the queue
          return res.status(200).json({ position: null })
        }
        throw userCheckError
      }

      // If the user is in the queue, calculate their position
      const { count, error } = await supabase
        .from('queue_members')
        .select('*', { count: 'exact' })
        .eq('queue_id', queueId)
        .lte('created_at', userInQueue.created_at)

      if (error) throw error

      return res.status(200).json({ position: count })
    } catch (error) {
      console.error('Error getting queue position:', error)
      return res.status(500).json({ error: 'Error getting queue position' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}