import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { search } = req.query;

  try {
    let query = supabase.from('queues').select('*, average_rating');

if (search) {
  query = query.ilike('name', `%${search}%`);
}

const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ error: 'An error occurred while fetching queues' });
  }
}