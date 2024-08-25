import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'PUT') {
    const { queueId, serviceStartTime } = req.body

    try {
      const { data, error } = await supabase
        .from('queues')
        .update({ service_start_time: serviceStartTime })
        .eq('id', queueId)
        .single()

      if (error) throw error

      return res.status(200).json({ message: 'Service start time updated successfully' })
    } catch (error) {
      console.error('Error updating service start time:', error)
      return res.status(500).json({ error: 'Failed to update service start time' })
    }
  }
}