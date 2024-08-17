import Link from 'next/link';
import { FiClock, FiMapPin, FiUsers, FiTag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

export default function QueueCard({ queue }) {
  return (
    <Link href={`/queue/${queue.id}`} passHref>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative cursor-pointer min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#292680] truncate">{queue.name}</h2>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded mx-4">
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
          <div className="flex items-center text-sm text-gray-600">
            <FiTag className="mr-2 text-[#6f6cd3]" />
            <span>Category: <strong>{queue.categories ? queue.categories.name : 'Uncategorized'}</strong></span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
          <span className="text-gray-700">Current members:</span>
          <span className="font-semibold text-[#6f6cd3] bg-[#6f6cd3] bg-opacity-10 px-2 py-1 rounded">{queue.member_count}</span>
        </div>
      </div>
    </Link>
  );
}