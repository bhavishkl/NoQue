import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { search, lat, lon } = req.query;

  try {
    if (lat && lon) {
      const { data: nearbyQueues, error } = await supabase
        .from('queues')
        .select(`
          *,
          cities!inner(name, latitude, longitude)
        `);

      if (error) {
        throw error;
      }

      const filteredQueues = nearbyQueues.map(queue => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lon),
          queue.cities.latitude,
          queue.cities.longitude
        );
        return { ...queue, distance };
      });

      const sortedQueues = filteredQueues.sort((a, b) => a.distance - b.distance);

      const queuesWithMemberCount = await Promise.all(sortedQueues.map(async (queue) => {
        const { count } = await supabase
          .from('queue_members')
          .select('*', { count: 'exact', head: true })
          .eq('queue_id', queue.id);

        return { ...queue, memberCount: count || 0 };
      }));

      const searchFilteredQueues = search
        ? queuesWithMemberCount.filter(queue => 
            queue.name.toLowerCase().includes(search.toLowerCase()) ||
            queue.cities.name.toLowerCase().includes(search.toLowerCase())
          )
        : queuesWithMemberCount;

      res.status(200).json(searchFilteredQueues);
    } else {
      res.status(400).json({ error: 'Latitude and longitude are required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching queues', details: error.message });
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}