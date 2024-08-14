import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (req.method === 'POST') {
    const { name, description, location, estimated_service_time, max_capacity } = req.body

    try {
      const { data, error } = await supabase
        .from('queues')
        .insert({
          owner_id: session.user.id,
          name,
          description,
          location,
          estimated_service_time,
          max_capacity
        })
        .select()

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error creating queue:', error)
      return res.status(500).json({ error: 'Error creating queue' })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}