import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { queueId } = req.query

  if (req.method === 'GET') {
    try {
      const { data: queueMembers, error: queueMembersError, count } = await supabase
  .from('queue_members')
  .select(`
    id,
    created_at,
    profiles (name)
  `, { count: 'exact' })
  .eq('queue_id', queueId)
  .order('created_at', { ascending: true });

if (queueMembersError) {
  console.error('Error fetching queue members:', queueMembersError);
  return res.status(500).json({ error: 'Error fetching queue members' });
}

const members = queueMembers.map((member, index) => ({
  id: member.id,
  position: index + 1,
  name: member.profiles?.name || 'Anonymous',
  joinTime: member.created_at
}));

return res.status(200).json({ members, count });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}