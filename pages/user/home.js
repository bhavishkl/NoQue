import { useState } from 'react';
import Layout from '../../components/layout';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import QueueCard from '../../components/QueueCard';
import { FiSearch } from 'react-icons/fi';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import HomeSkeleton from '../../components/skeletons/HomeSkeleton';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { session } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: recentQueues, error, isLoading } = useSWR(
    session ? '/api/user/recent-queues' : null,
    fetcher
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/user/queues?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (error) {
    toast.error('Failed to fetch recent queues. Please try again later.');
  }

  if (isLoading) {
    return (
      <Layout>
        <HomeSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Welcome to QueueMaster</h1>
        
        <div className="w-full max-w-2xl mb-12">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for queue management solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="w-full mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Queues</h2>
          <div className="overflow-x-auto">
            {recentQueues && recentQueues.length > 0 ? (
              <div className="flex justify-center space-x-6 pb-4">
                {recentQueues.map((queue) => (
                  <div key={queue.id} className="flex-shrink-0">
                    <QueueCard queue={queue} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No recent queues found.</p>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <Link href="/user/queues" className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            View All Available Queues
          </Link>
        </div>
      </div>
    </Layout>
  );
}