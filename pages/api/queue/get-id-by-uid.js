import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('queues')
      .select('id')
      .eq('queue_uid', uid)
      .single();

    if (error) throw error;

    if (data) {
      res.status(200).json({ id: data.id });
    } else {
      res.status(404).json({ error: 'Queue not found' });
    }
  } catch (error) {
    console.error('Error fetching queue ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}