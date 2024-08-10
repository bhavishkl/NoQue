import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'

export default function EditQueue() {
  const { session, isLoading } = useAuth(true)
  const [queue, setQueue] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [estimatedServiceTime, setEstimatedServiceTime] = useState('')
  const [maxCapacity, setMaxCapacity] = useState('')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id && session) {
      fetchQueueDetails()
    }
  }, [id, session])

  async function fetchQueueDetails() {
    try {
      setLoading(true)
      const response = await fetch(`/api/queue/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch queue details')
      }
      const data = await response.json()
      setQueue(data)
      setName(data.name)
      setDescription(data.description)
      setLocation(data.location)
      setEstimatedServiceTime(data.estimated_service_time)
      setMaxCapacity(data.max_capacity)
    } catch (error) {
      console.error('Error fetching queue details:', error)
      toast.error('Failed to fetch queue details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          location,
          estimated_service_time: parseInt(estimatedServiceTime),
          max_capacity: parseInt(maxCapacity)
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update queue')
      }
      toast.success('Queue updated successfully')
      router.push('/queue-owner/dashboard')
    } catch (error) {
      console.error('Error updating queue:', error)
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
        <div className="text-center">Loading queue details...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit Queue: {queue?.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Queue Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="estimatedServiceTime" className="block text-sm font-medium text-gray-700">Estimated Service Time (minutes)</label>
            <input
              type="number"
              id="estimatedServiceTime"
              value={estimatedServiceTime}
              onChange={(e) => setEstimatedServiceTime(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
            <input
              type="number"
              id="maxCapacity"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Queue
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}