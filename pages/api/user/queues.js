import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { page = 1, limit = 9, search, sortBy = 'name' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase.from('queues').select('*, average_rating', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    switch (sortBy) {
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'wait_time':
        query = query.order('total_estimated_wait_time', { ascending: true });
        break;
      default:
        query = query.order('name', { ascending: true });
    }

    const { data: queues, count, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const queuesWithCount = await Promise.all(queues.map(async (queue) => {
      const { count: memberCount } = await supabase
        .from('queue_members')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', queue.id);

      return { ...queue, member_count: memberCount };
    }));

    res.status(200).json({
      queues: queuesWithCount,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ error: 'An error occurred while fetching queues' });
  }
}