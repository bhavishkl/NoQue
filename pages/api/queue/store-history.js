import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function storeHistory(req, res, { memberId, queueId, status }) {
  const supabase = createPagesServerClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  try {
    // Get queue member details
    const { data: memberData, error: memberError } = await supabase
  .from('queue_members')
  .select('*, profiles(id), queues!fk_queue_id(name)')
  .eq('id', memberId)
  .single()

    if (memberError) throw memberError

    const historyEntry = {
      queue_id: queueId,
      queue_name: memberData.queues.name,
      join_time: memberData.created_at,
      exit_time: new Date().toISOString(),
      status: status
    }

    // Update profiles table with new history entry
const { data: profileData, error: profileError } = await supabase
.from('profiles')
.select('queue_history')
.eq('id', memberData.profiles.id)
.single()

if (profileError) throw profileError

const updatedHistory = profileData.queue_history ? [...profileData.queue_history, historyEntry] : [historyEntry]

const { error: updateError } = await supabase
.from('profiles')
.update({ queue_history: updatedHistory })
.eq('id', memberData.profiles.id)

    if (updateError) throw updateError

    // Remove user from queue_members
    const { error: deleteError } = await supabase
      .from('queue_members')
      .delete()
      .eq('id', memberId)

    if (deleteError) throw deleteError

    return { message: 'History stored and member removed from queue' }
  } catch (error) {
    console.error('Error storing history:', error)
    throw error
  }
}