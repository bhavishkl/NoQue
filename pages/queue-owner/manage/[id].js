import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Layout from '../../../components/layout'
import { toast } from 'react-toastify'
import { FiCheck, FiX } from 'react-icons/fi'
import ManageQueueSkeleton from '../../../components/skeletons/ManageQueueSkeleton';

export default function ManageQueue() {
  const [queue, setQueue] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const session = useSession()
  const router = useRouter()
  const { id } = router.query
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (id && session) {
      fetchQueueDetails()
      fetchQueueMembers()

      const channel = supabase
        .channel(`queue_${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_members' }, (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT') {
            toast.info('A new user has joined the queue!', {
              position: "bottom-right",
              autoClose: 3000,
            })
          } else if (payload.eventType === 'DELETE') {
            toast.info('A user has left the queue', {
              position: "bottom-right",
              autoClose: 3000,
            })
          }
          fetchQueueMembers()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [id, session, supabase])

  async function fetchQueueDetails() {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setQueue(data)
    } catch (error) {
      console.error('Error fetching queue details:', error)
      toast.error('Failed to fetch queue details')
    }
  }

  async function fetchQueueMembers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('queue_members')
        .select(`
          id,
          created_at,
          profiles (name)
        `)
        .eq('queue_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      const formattedMembers = data.map((member, index) => ({
        id: member.id,
        position: index + 1,
        name: member.profiles?.name || 'Anonymous',
        joinTime: new Date(member.created_at).toLocaleString()
      }))
      setMembers(formattedMembers)
    } catch (error) {
      console.error('Error fetching queue members:', error)
      toast.error('Failed to fetch queue members')
    } finally {
      setLoading(false)
    }
  }

  async function updateMemberStatus(memberId, status) {
    try {
      const response = await fetch('/api/queue/update-member-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, queueId: id, status }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member status');
      }
  
      toast.success(`Member marked as ${status}`);
      fetchQueueMembers();  // Refresh the list after updating
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  }
  if (!session) {
    return (
      <Layout>
        <div className="text-center">Not authenticated</div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <ManageQueueSkeleton />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Queue: {queue?.name}</h1>
        {queue && (
          <div className="mb-6">
            <p className="text-lg text-gray-600">
              Current members: <span className="font-semibold">{members.length}</span>
            </p>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading queue members...</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joinTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => updateMemberStatus(member.id, 'served')}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        <FiCheck className="inline-block mr-1" /> Served
                      </button>
                      <button
                        onClick={() => updateMemberStatus(member.id, 'no-show')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiX className="inline-block mr-1" /> No Show
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}