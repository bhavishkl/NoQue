import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/layout'
import Link from 'next/link'
import { FiEdit, FiBarChart2, FiTrash2, FiAlertCircle, FiPlus, FiUsers, FiClock } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { fetchOwnerQueues, deleteQueue } from '../../redux/slices/queueSlice'
import QueueDashboardSkeleton from '../../components/skeletons/QueueDashboardSkeleton'

const QueueCard = ({ queue, onDelete }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-xl font-semibold mb-2">{queue.name}</h2>
    <p className="text-gray-600 mb-4 line-clamp-2">{queue.description}</p>
    <div className="flex items-center text-sm text-gray-500 mb-4">
      <FiUsers className="mr-2" />
      <span>Capacity: {queue.max_capacity}</span>
      <FiClock className="ml-4 mr-2" />
      <span>Est. wait: {queue.estimated_service_time} min</span>
    </div>
    <div className="flex justify-between items-center">
      <Link href={`/queue-owner/manage/${queue.id}`} className="text-blue-500 hover:text-blue-600 transition duration-200">
        <FiEdit className="inline mr-1" /> Manage
      </Link>
      <Link href={`/queue/queue-analytics?id=${queue.id}`} className="text-green-500 hover:text-green-600 transition duration-200">
        <FiBarChart2 className="inline mr-1" /> Analytics
      </Link>
      <button
        onClick={() => onDelete(queue)}
        className="text-red-500 hover:text-red-600 transition duration-200"
      >
        <FiTrash2 className="inline mr-1" /> Delete
      </button>
    </div>
  </div>
)

export default function QueueDashboard() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const dispatch = useDispatch()
  const { queues, loading: queuesLoading, error } = useSelector((state) => state.queue)
  const [showModal, setShowModal] = useState(false)
  const [queueToDelete, setQueueToDelete] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOwnerQueues())
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(`Failed to fetch queues: ${error}`)
    }
  }, [error])

  const handleDeleteQueue = async (queueId) => {
    try {
      await dispatch(deleteQueue(queueId)).unwrap()
      toast.success('Queue deleted successfully')
    } catch (error) {
      toast.error('Failed to delete queue. Please try again.')
    } finally {
      setShowModal(false)
      setQueueToDelete(null)
    }
  }

  if (authLoading || queuesLoading) {
    return (
      <Layout>
        <QueueDashboardSkeleton />
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">Queue Owner Dashboard</h1>
          <Link href="/queue/create-queue" className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-200 flex items-center">
            <FiPlus className="mr-2" /> Create New Queue
          </Link>
        </div>
        {queues.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queues.map((queue) => (
              <QueueCard key={queue.id} queue={queue} onDelete={(queue) => {
                setQueueToDelete(queue)
                setShowModal(true)
              }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No queues</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new queue.</p>
            <div className="mt-6">
              <Link href="/queue/create-queue" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Queue
              </Link>
            </div>
          </div>
        )}
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteQueue(queueToDelete.id)}
                >
                  Delete
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