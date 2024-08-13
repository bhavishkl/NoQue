import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaStar, FaUserCircle } from 'react-icons/fa'

export default function ReviewList({ queueId }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/get-queue-reviews?queueId=${queueId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [queueId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg font-semibold">No reviews yet</p>
        <p className="mt-2">Be the first to leave a review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
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
    </div>
  )
}