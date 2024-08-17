import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { handleApiError } from '../../../utils/errorHandler'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'POST') {
    const { queueId, rating, comment } = req.body

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError

      // Start a transaction
      const { data, error } = await supabase.rpc('submit_review_and_update_average', {
        p_user_id: profileData.id,
        p_queue_id: queueId,
        p_rating: rating,
        p_comment: comment
      })

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      return handleApiError(res, error, 'Error submitting review')
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}