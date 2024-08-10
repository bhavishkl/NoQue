import { useState, useEffect } from 'react'
import Layout from '../../components/layout'
import Link from 'next/link'
import { FiEdit, FiBarChart2, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'

export default function QueueDashboard() {
  const { session, isLoading } = useAuth(true)
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingQueue, setDeletingQueue] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [queueToDelete, setQueueToDelete] = useState(null)

  useEffect(() => {
    if (session) {
      fetchOwnerQueues()
    }
  }, [session])

  async function fetchOwnerQueues() {
    try {
      setLoading(true)
      const response = await fetch('/api/queue/queue-owner')
      if (!response.ok) {
        throw new Error('Failed to fetch queues')
      }
      const data = await response.json()
      setQueues(data)
    } catch (error) {
      console.error('Error fetching queues:', error)
      toast.error('Failed to fetch queues. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteQueue(queueId) {
    setDeletingQueue(queueId)
    try {
      const response = await fetch(`/api/queue/delete-queue?queueId=${queueId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete queue')
      }
      toast.success('Queue deleted successfully')
      fetchOwnerQueues()
    } catch (error) {
      console.error('Error deleting queue:', error)
      toast.error('Failed to delete queue. Please try again.')
    } finally {
      setDeletingQueue(null)
      setShowModal(false)
      setQueueToDelete(null)
    }
  }

  if (!session) {
    return (
      <Layout>
        <div className="text-center">Not authenticated</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Queue Owner Dashboard</h1>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading queues...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queues.map((queue) => (
              <div key={queue.id} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-2">{queue.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{queue.description}</p>
                <div className="flex justify-between items-center">
                  <Link href={`/queue-owner/manage/${queue.id}`} className="text-blue-500 hover:text-blue-600">
                    <FiEdit className="inline mr-1" /> Manage
                  </Link>
                  <Link href={`/queue/queue-analytics?id=${queue.id}`} className="text-green-500 hover:text-green-600">
                    <FiBarChart2 className="inline mr-1" /> Analytics
                  </Link>
                  <button
                    onClick={() => {
                      setQueueToDelete(queue)
                      setShowModal(true)
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/queue/create-queue" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
            Create New Queue
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Queue</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the queue "{queueToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    deletingQueue === queueToDelete?.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleDeleteQueue(queueToDelete.id)}
                  disabled={deletingQueue === queueToDelete?.id}
                >
                  {deletingQueue === queueToDelete?.id ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowModal(false)
                    setQueueToDelete(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}