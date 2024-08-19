import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-toastify'
import { FaStar, FaUserCircle } from 'react-icons/fa'

export default function ReviewList({ queueId }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef()

  const lastReviewElementRef = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  const fetchReviews = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews/get-queue-reviews?queueId=${queueId}&page=${page}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(prevReviews => [...prevReviews, ...data.reviews])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [queueId, page, isLoading, hasMore])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  if (reviews.length === 0 && !isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg font-semibold">No reviews yet</p>
        <p className="mt-2">Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div
          key={review.id}
          ref={index === reviews.length - 1 ? lastReviewElementRef : null}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaUserCircle className="text-gray-400 text-3xl mr-3" />
              <div>
                <div className="font-semibold text-lg text-gray-800">{review.profiles.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < review.rating ? "text-yellow-400" : "text-gray-300"}
                  size={20}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 mt-3">{review.comment}</p>
        </div>
      ))}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}
    </div>
  )
}