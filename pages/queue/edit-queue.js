import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQueueDetails, updateQueue } from '../../redux/slices/queueSlice'

export default function EditQueue() {
  const { session } = useAuth(true)
  const dispatch = useDispatch()
  const { currentQueue, loading, error } = useSelector((state) => state.queue)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    estimatedServiceTime: '',
    maxCapacity: ''
  })
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id && session) {
      dispatch(fetchQueueDetails(id))
    }
  }, [id, session, dispatch])

  useEffect(() => {
    if (currentQueue) {
      setFormData({
        name: currentQueue.name,
        description: currentQueue.description,
        location: currentQueue.location,
        estimatedServiceTime: currentQueue.estimated_service_time,
        maxCapacity: currentQueue.max_capacity
      })
    }
  }, [currentQueue])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateQueue({ id, ...formData })).unwrap()
      toast.success('Queue updated successfully')
      router.push('/queue/queue-dashboard')
    } catch (error) {
      toast.error('Failed to update queue. Please try again.')
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
        <div className="text-center">Loading...</div>
      </Layout>
    )
  }

  if (error) {
    toast.error('Failed to fetch queue details. Please try again.')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Queue</h1>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
            Update Queue
          </button>
        </form>
      </div>
    </Layout>
  )
}