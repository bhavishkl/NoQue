import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  await supabase.auth.getSession()
  res.status(200).json({ message: 'Authentication route' })
}