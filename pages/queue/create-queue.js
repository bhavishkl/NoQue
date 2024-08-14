import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { toast } from 'react-toastify'
import CreateQueueSkeleton from '../../components/skeletons/CreateQueueSkeleton'
import { FiClock, FiMapPin, FiUsers, FiInfo } from 'react-icons/fi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateQueue() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [estimatedServiceTime, setEstimatedServiceTime] = useState('')
  const [maxCapacity, setMaxCapacity] = useState('')
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('')

  const router = useRouter()

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, state, latitude, longitude')
        .order('name', { ascending: true })
  
      if (error) throw error
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Failed to fetch cities. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedCityData = cities.find(city => city.id === parseInt(selectedCity))
      const response = await fetch('/api/queue/create-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          location,
          estimated_service_time: parseInt(estimatedServiceTime),
          max_capacity: parseInt(maxCapacity),
          city_id: parseInt(selectedCity),
          city_name: selectedCityData.name,
          latitude: selectedCityData.latitude,
          longitude: selectedCityData.longitude
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create queue')
      }

      const data = await response.json()
      toast.success('Queue created successfully!')
      router.push('/queue/queue-dashboard')
    } catch (error) {
      console.error('Error creating queue:', error)
      toast.error('Failed to create queue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <CreateQueueSkeleton />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Queue</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Queue Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter queue name"
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
              placeholder="Describe the purpose of this queue"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter queue location"
              />
            </div>
          </div>
          <div>
            <label htmlFor="estimatedServiceTime" className="block text-sm font-medium text-gray-700">Estimated Service Time (minutes)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="estimatedServiceTime"
                value={estimatedServiceTime}
                onChange={(e) => setEstimatedServiceTime(e.target.value)}
                required
                min="1"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter estimated service time"
              />
            </div>
          </div>
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="maxCapacity"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                required
                min="1"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter maximum capacity"
              />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Queue Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Make sure to provide accurate information for your queue. This will help users decide whether to join your queue.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {loading ? 'Creating...' : 'Create Queue'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}