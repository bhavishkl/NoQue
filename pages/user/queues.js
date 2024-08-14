import React, { useState, useCallback, useEffect } from 'react'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import { FiClock, FiMapPin, FiUsers, FiSearch, FiFilter } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import QueuesSkeleton from '../../components/skeletons/QueuesSkeleton'
import { useApi } from '../../hooks/useApi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const QueueItem = React.memo(({ queue }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-[#292680] truncate">{queue.name}</h2>
      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
        <FaStar className="text-yellow-500 mr-1" />
        <span className="font-medium text-[#292680]">{queue.average_rating.toFixed(1)}</span>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <FiMapPin className="mr-2 text-[#6f6cd3]" />
        <span className="truncate">{queue.location}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <FiClock className="mr-2 text-[#6f6cd3]" />
        <span>Est. total wait: <strong>{queue.total_estimated_wait_time} min</strong></span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <FiUsers className="mr-2 text-[#6f6cd3]" />
        <span>Capacity: <strong>{queue.max_capacity}</strong></span>
      </div>
    </div>
    <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
      <span className="text-gray-700">Current members:</span>
      <span className="font-semibold text-[#6f6cd3] bg-[#6f6cd3] bg-opacity-10 px-2 py-1 rounded">{queue.member_count}</span>
    </div>
    <Link href={`/queue/${queue.id}`}>
      <span className="block w-full text-center bg-[#6f6cd3] text-white py-2 px-4 rounded mt-4 hover:bg-[#3532a7] transition duration-200 cursor-pointer">
        View Queue
      </span>
    </Link>
  </div>
))

export default function Queues() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [userLocation, setUserLocation] = useState(null)
  const router = useRouter()
  const { search } = router.query
  const { data: queues, isLoading: queuesLoading, isError, mutate } = useApi(
    isAuthenticated && userLocation
      ? `/api/user/queues?lat=${userLocation.latitude}&lon=${userLocation.longitude}${search ? `&search=${search}` : ''}`
      : null
  )

  useEffect(() => {
    if (isAuthenticated) {
      getUserLocation(true);
      console.log('Calling getUserLocation with high accuracy');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (queues) {
      console.log('Queues received:', queues);
    }
  }, [queues]);

  const getUserLocation = (highAccuracy = true) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          console.log('User location:', userLat, userLon);
          console.log('Accuracy:', position.coords.accuracy, 'meters');
          
          if (highAccuracy && position.coords.accuracy > 100) {
            console.log('Location not accurate enough, retrying...');
            setTimeout(() => getUserLocation(true), 1000);
            return;
          }
          
          setUserLocation({
            latitude: userLat,
            longitude: userLon
          });
          console.log('User location set:', userLat, userLon);
        },
        (error) => {
          console.error("Error getting user location:", error);
          if (highAccuracy) {
            console.log('Retrying with low accuracy...');
            setTimeout(() => getUserLocation(false), 1000);
          } else {
            toast.error("Unable to get your location. Showing all queues.");
            setUserLocation({ latitude: null, longitude: null });
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported. Showing all queues.");
      setUserLocation({ latitude: null, longitude: null });
    }
  };

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value)
  }, [])

  const filteredAndSortedQueues = Array.isArray(queues) ? queues
  .filter((queue) =>
    queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    queue.cities.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'rating') return b.average_rating - a.average_rating
    if (sortBy === 'wait_time') return a.total_estimated_wait_time - b.total_estimated_wait_time
    if (sortBy === 'distance') return a.distance - b.distance
    return 0
  }) : []

  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch queues. Please try again.')
    }
  }, [isError])

  if (authLoading || queuesLoading) {
    return (
      <Layout>
        <QueuesSkeleton />
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-4 sm:mt-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#292680]">Available Queues</h1>
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:flex-grow">
            <input
              type="text"
              placeholder="Search queues..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f6cd3]"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6f6cd3]"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="wait_time">Sort by Wait Time</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        {filteredAndSortedQueues.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-xl text-gray-600 mb-2 sm:mb-4">No queues found.</p>
            <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or check back later for new queues.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedQueues.map((queue) => (
              <QueueItem key={queue.id} queue={queue} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}