import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { page = 1, limit = 9, search } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase.from('queues').select('*, average_rating, member_count', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: queues, count, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.status(200).json({
      queues,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ error: 'An error occurred while fetching queues' });
  }
}