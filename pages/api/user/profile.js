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
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      return res.status(500).json({ error: 'Error fetching profile' })
    }
  }

  if (req.method === 'PUT') {
    const { name, bio } = req.body

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ name, bio })
        .eq('id', session.user.id)

      if (error) throw error

      return res.status(200).json(data)
    } catch (error) {
      console.error('Error updating profile:', error)
      return res.status(500).json({ error: 'Error updating profile' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}