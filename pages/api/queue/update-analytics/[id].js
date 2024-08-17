import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { id } = req.query
  const supabase = createPagesServerClient({ req, res })

  try {
    // Fetch the updated queue data
    const { data: updatedQueueData, error: fetchError } = await supabase
      .from('queues')
      .select('member_count, estimated_service_time')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Calculate new total estimated wait time
    const newEstimatedWaitTime = updatedQueueData.member_count * updatedQueueData.estimated_service_time

    // Update the total_estimated_wait_time
    await supabase
      .from('queues')
      .update({ total_estimated_wait_time: newEstimatedWaitTime })
      .eq('id', id)

    // Perform any other necessary analytics calculations here

    res.status(200).json({ message: 'Analytics updated successfully' })
  } catch (error) {
    console.error('Error updating analytics:', error)
    res.status(500).json({ error: 'Error updating analytics' })
  }
}