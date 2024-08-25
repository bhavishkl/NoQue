import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/layout'
import { FiClock, FiMapPin, FiUsers, FiRefreshCw, FiAlertCircle, FiTag, FiHash, FiCopy } from 'react-icons/fi'
import { FaStar, FaUserCircle } from 'react-icons/fa'
import { message } from 'antd'
import Link from 'next/link'
import QueueDetailsSkeleton from '../../components/skeletons/QueueDetailsSkeleton'
import { useAuth } from '../../hooks/useAuth'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { fetchQueueDetails, joinQueue, leaveQueue } from '../../redux/slices/queueSlice'
import dynamic from 'next/dynamic'
import QueueErrorBoundary from '../../components/ErrorHandlers/QueueErrorBoundary'
import { format } from 'date-fns'
import PaymentButton from '../../components/PaymentButton'
import Lottie from 'lottie-react';
import successAnimation from '../../public/animations/success-animation.json';
import { motion } from 'framer-motion';
const ReviewForm = dynamic(() => import('../../components/ReviewForm'), {
  loading: () => <p className="text-center text-gray-500">Loading review form...</p>,
})
function formatServiceStartTime(timeString) {
  if (!timeString) return 'Not set';
  
  // Assuming the timeString is in HH:mm:ss format
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return format(date, 'h:mm a');
}

const Countdown = ({ expectedAt }) => {
  const [timeLeft, setTimeLeft] = useState('')
    
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const expected = new Date(expectedAt)
      if (now >= expected) {
        setTimeLeft('Time expired')
        clearInterval(timer)
      } else {
        const diff = expected.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [expectedAt])
  return <span>{timeLeft}</span>
}
export default function QueueDetails() {
  const { isLoading: authLoading, isAuthenticated } = useAuth(true)
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const { currentQueue: queue, loading: queueLoading, error } = useSelector((state) => state.queue)
  const supabase = useSupabaseClient()
  const [topReviews, setTopReviews] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  useEffect(() => {
  if (isAuthenticated && id) {
    dispatch(fetchQueueDetails(id)).then((action) => {
      if (action.payload && action.payload.top_reviews) {
        setTopReviews(action.payload.top_reviews)
      }
    })
  }
}, [isAuthenticated, id, dispatch])
  useEffect(() => {
    if (error) {
      message.error('Failed to fetch queue details. Please try again.')
    }
  }, [error])
  useEffect(() => {
    if (!queue || !isAuthenticated || !id) return
    const channel = supabase
      .channel(`queue_${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'queue_members',
        filter: `queue_id=eq.${id}`
      }, (payload) => {
        if (payload.new && payload.new.queue_id === id) {
          dispatch(fetchQueueDetails(id))
        }
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queue, id, isAuthenticated, supabase, dispatch])
  const handlePaymentSuccess = async (paymentId) => {
    try {
      const response = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId: id, paymentId }),
      });
      if (!response.ok) {
        throw new Error('Failed to join queue');
      }
      dispatch(fetchQueueDetails(id));
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error joining queue:', error);
      message.error('Failed to join queue. Please try again.');
    }
  };
  const handleLeaveQueue = async () => {
    try {
      await dispatch(leaveQueue(id)).unwrap()
      message.success('Successfully left the queue')
    } catch (error) {
      message.error('Failed to leave queue. Please try again.')
    }
  }
  if (authLoading || queueLoading) {
    return (
      <Layout>
        <QueueDetailsSkeleton />
      </Layout>
    )
  }
  if (!isAuthenticated) {
    return null // The useAuth hook will handle redirection
  }
  return (
    <Layout>
      <QueueErrorBoundary>
        {queue ? (
          <>
           <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
  <div className="max-w-4xl mx-auto px-4 py-4">
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-2xl font-bold text-gray-800">{queue.name}</h1>
      <div className="flex items-center space-x-4">
        {queue.isJoined ? (
          <button
            onClick={handleLeaveQueue}
            disabled={queueLoading}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50"
          >
            Leave Queue
          </button>
        ) : (
          <PaymentButton
            amount={10} // 10 INR
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        <button
          onClick={() => dispatch(fetchQueueDetails(id))}
          disabled={queueLoading}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-200 disabled:opacity-50"
        >
          <FiRefreshCw className={`${queueLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Category: <span className="font-semibold">{queue.categories ? queue.categories.name : 'Uncategorized'}</span>
      </p>
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
        queue Joining Fee: ₹10
      </div>
    </div>
  </div>
</div>
            <div className="max-w-4xl mx-auto mt-8 px-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{queue.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QueueInfoItem icon={FiMapPin} label="Location" value={queue.location} />
                    <QueueInfoItem icon={FiClock} label="Service start time" value={queue.service_start_time ? formatServiceStartTime(queue.service_start_time) : 'Not set'} />
                    <QueueInfoItem icon={FiUsers} label="Capacity" value={queue.max_capacity} />
                    <QueueInfoItem icon={FiUsers} label="Current members" value={queue.memberCount} />
                    <QueueInfoItem icon={FaStar} label="Rating" value={`${queue.average_rating ? queue.average_rating.toFixed(1) : 'N/A'} (${queue.reviewCount || 0} reviews)`} />
                    <QueueInfoItem icon={FiTag} label="Category" value={queue.categories ? queue.categories.name : 'Uncategorized'} />
                  </div>
                  <div className="mt-4">
                    <QueueInfoItem icon={FiHash} label="Queue UID" value={queue.queue_uid || 'N/A'} copyable />
                  </div>
                </div>
              </div>
              <QueueStatus queue={queue} />
              <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                  <ReviewList reviews={topReviews} queueId={id} />
                </div>
                <div className="border-t border-gray-200 p-6">
                  <ReviewForm queueId={queue.id} onReviewSubmitted={() => dispatch(fetchQueueDetails(id))} />
                </div>
              </div>
            </div>
            <Link href={`/queue/queue-members?id=${id}`}>
  <button className="fixed bottom-36 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-200 z-50">
    <FiUsers size={24} />
  </button>
</Link>
          </>
        ) : (
          <QueueNotFound />
        )}
        <AnimatedSuccessModal
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
      </QueueErrorBoundary>
    </Layout>
  )
}
const QueueInfoItem = ({ icon: Icon, label, value, copyable = false }) => (
  <div className="flex items-center text-gray-700">
    <Icon className="mr-2 text-blue-500" />
    <span>{label}: <strong>{value}</strong></span>
    {copyable && (
      <button
        onClick={() => {
          navigator.clipboard.writeText(value);
          message.success({ content: `${label} copied to clipboard!`, duration: 2 });
        }}
        className="ml-2 text-blue-500 hover:text-blue-600"
      >
        <FiCopy />
      </button>
    )}
  </div>
)
const QueueStatus = ({ queue }) => (
  <div className={`p-6 rounded-lg shadow-md ${queue.userPosition ? 'bg-blue-100' : 'bg-yellow-100'}`}>
    <h3 className={`text-2xl font-bold mb-4 ${queue.userPosition ? 'text-blue-800' : 'text-yellow-800'}`}>
      {queue.userPosition ? 'Your Queue Status' : 'Queue Information'}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {queue.userPosition ? (
        <>
          <StatusCard label="Your position" value={queue.userPosition} />
          <StatusCard label="Estimated wait time" value={`${queue.userEstimatedWaitTime} min`} />
          {queue.userExpectedTime && (
            <>
              <StatusCard label="Expected service time" value={queue.userExpectedTime} />
              <StatusCard label="Time until your turn" value={<Countdown expectedAt={queue.userExpectedTime} />} />
            </>
          )}
        </>
      ) : (
        <StatusCard label="Estimated wait time" value={`${queue.estimatedWaitTime} min`} />
      )}
    </div>
  </div>
)
const StatusCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-lg text-blue-600 mb-1">{label}</p>
    <p className="text-3xl font-bold text-blue-800">{value}</p>
  </div>
)
const ReviewList = ({ reviews, queueId }) => (
  <>
    {reviews.length > 0 ? (
      <>
        {reviews.slice(0, 3).map((review, index) => (
          <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUserCircle className="text-gray-400 text-3xl mr-3" />
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {review.user_name || 'Anonymous User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    size={20}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
          </div>
        ))}
        <Link href={`/queue/reviews/${queueId}`} className="text-blue-500 hover:text-blue-600 font-semibold">
          View All Reviews
        </Link>
      </>
    ) : (
      <p className="text-gray-500">No reviews yet.</p>
    )}
  </>
)
const QueueNotFound = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <FiAlertCircle className="text-5xl text-red-500 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-700">Queue not found</h2>
    <p className="mt-2 text-gray-500">The queue you're looking for doesn't exist or has been removed.</p>
    <Link href="/user/queues" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
      Browse Queues
    </Link>
  </div>
)
const AnimatedSuccessModal = ({ isOpen, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          <Lottie
            animationData={successAnimation}
            loop={true}
            style={{ width: 200, height: 200, margin: '0 auto' }}
          />
          <h2 className="text-2xl font-bold text-green-600 mt-4">Successfully Joined the Queue!</h2>
          <p className="text-gray-600 mt-2">
            Relax and wait for updates on WhatsApp. We'll notify you as your turn approaches.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};