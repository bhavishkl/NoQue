import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('queue_history')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const recentQueueIds = profileData.queue_history
        .slice(-5)
        .map(entry => entry.queue_id);

      const { data: queuesData, error: queuesError } = await supabase
        .from('queues')
        .select('*')
        .in('id', recentQueueIds);

      if (queuesError) throw queuesError;

      const queuesWithCount = await Promise.all(queuesData.map(async (queue) => {
        const { count } = await supabase
          .from('queue_members')
          .select('*', { count: 'exact', head: true })
          .eq('queue_id', queue.id);

        return { ...queue, member_count: count };
      }));

      return res.status(200).json(queuesWithCount);
    } catch (error) {
      console.error('Error fetching recent queues:', error);
      return res.status(500).json({ error: 'Error fetching recent queues' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}