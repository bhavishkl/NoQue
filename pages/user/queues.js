import React, { useState, useCallback, useEffect } from 'react'
import Layout from '../../components/layout'
import { useRouter } from 'next/router'
import { FiClock, FiMapPin, FiUsers, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import QueuesSkeleton from '../../components/skeletons/QueuesSkeleton'
import { useApi } from '../../hooks/useApi'

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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center">
        <li className="mx-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="mx-1">
            <button
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number
                  ? 'bg-[#6f6cd3] text-white'
                  : 'bg-white text-[#6f6cd3] border border-[#6f6cd3] hover:bg-[#6f6cd3] hover:text-white'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className="mx-1">
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default function Queues() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [queuesPerPage] = useState(9)
  const router = useRouter()
  const { search } = router.query
  const { data, isLoading: queuesLoading, isError, mutate } = useApi(
    isAuthenticated
      ? `/api/user/queues?page=${currentPage}&limit=${queuesPerPage}&sortBy=${sortBy}${search ? `&search=${search}` : ''}`
      : null
  )

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber)
  }, [])

  const filteredAndSortedQueues = data?.queues || []
  const totalPages = Math.ceil(data?.total / queuesPerPage) || 0

  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch queues. Please try again.')
    }
  }, [isError])

  useEffect(() => {
    mutate()
  }, [currentPage, sortBy, search, mutate])

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
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedQueues.map((queue) => (
                <QueueItem key={queue.id} queue={queue} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  )
}