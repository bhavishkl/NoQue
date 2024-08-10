import Link from 'next/link';
import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

export default function QueueCard({ queue }) {
  return (
    <Link href={`/queue/${queue.id}`}>
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 w-72 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{queue.name}</h2>
        <div className="flex-grow">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FiMapPin className="mr-2 text-blue-500" />
            <span>{queue.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FiClock className="mr-2 text-green-500" />
            <span>Est. wait: {queue.estimated_service_time} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FiUsers className="mr-2 text-purple-500" />
            <span>Capacity: {queue.max_capacity}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Current members:</span>
            <span className="font-bold text-blue-600">{queue.member_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}