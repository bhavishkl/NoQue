import { useState } from 'react';
import Layout from '../../components/layout';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import dynamic from 'next/dynamic';
import { FiSearch, FiHash, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import HomeSkeleton from '../../components/skeletons/HomeSkeleton';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import QueueListErrorBoundary from '../../components/QueueListErrorBoundary';
import { MdRestaurant, MdLocalHospital, MdAccountBalance, MdShoppingCart, MdTheaterComedy } from 'react-icons/md';

const DynamicQueueCard = dynamic(() => import('../../components/QueueCard'), {
  loading: () => <div>Loading queue...</div>,
});

export default function UserHome({ initialRecentQueues }) {
  const { session, isLoading, user } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentQueues, setRecentQueues] = useState(initialRecentQueues);
  const [isSearching, setIsSearching] = useState(false);

const handleSearch = async (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    setIsSearching(true);
    const isUid = /^\d{5}$/.test(searchQuery.trim());
    if (isUid) {
      try {
        const response = await fetch(`/api/queue/get-id-by-uid?uid=${searchQuery.trim()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch queue ID');
        }
        const { id } = await response.json();
        if (id) {
          window.location.href = `/queue/${id}`;
        } else {
          toast.error('Queue not found');
        }
      } catch (error) {
        console.error('Error fetching queue ID:', error);
        toast.error('Failed to find queue. Please try again.');
      } finally {
        setIsSearching(false);
      }
    } else {
      window.location.href = `/user/queues?search=${encodeURIComponent(searchQuery)}`;
      setIsSearching(false);
    }
  }
};
  if (isLoading) {
    return (
      <Layout>
        <HomeSkeleton />
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Home | NoQue</title>
        <meta name="description" content="Manage your queues efficiently with NoQue. Search for queue management solutions and view your recent queues." />
        <meta name="keywords" content="queue management, NoQue, recent queues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#292680]">Welcome, {user?.name || 'User'}!</h1>
        
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center">
            <div className="relative flex-grow mb-2 sm:mb-0 sm:mr-2">
              <input
                type="text"
                placeholder="Search by name or enter Queue UID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-[#6f6cd3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f6cd3]"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6f6cd3]" />
            </div>
            <button
  type="submit"
  disabled={isSearching}
  className="w-full sm:w-auto px-6 py-3 bg-[#6f6cd3] text-white rounded-md hover:bg-[#3532a7] focus:outline-none focus:ring-2 focus:ring-[#6f6cd3] focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
>
  {isSearching ? (
    <>
      <span className="inline-block animate-spin mr-2">⌛</span>
      Searching...
    </>
  ) : (
    'Search'
  )}
</button>
          </form>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#292680]">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Restaurants', icon: MdRestaurant, color: 'bg-red-100 text-red-600' },
              { name: 'Healthcare', icon: MdLocalHospital, color: 'bg-blue-100 text-blue-600' },
              { name: 'Government', icon: MdAccountBalance, color: 'bg-green-100 text-green-600' },
              { name: 'Retail', icon: MdShoppingCart, color: 'bg-purple-100 text-purple-600' },
              { name: 'Entertainment', icon: MdTheaterComedy, color: 'bg-yellow-100 text-yellow-600' },
            ].map((category) => (
              <Link href={`/user/queues?category=${category.name}`} key={category.name} className="group">
                <div className="flex flex-col items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white">
                  <div className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon size={32} />
                  </div>
                  <span className="text-[#292680] group-hover:text-[#3532a7] transition-colors duration-300 text-sm font-medium text-center">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center mb-12">
          <Link href="/user/queues" className="inline-block px-8 py-3 text-lg font-semibold text-white bg-[#6f6cd3] rounded-md hover:bg-[#3532a7] transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            View All Available Queues
          </Link>
        </div>
  
        <QueueListErrorBoundary>
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6 text-[#292680]">Recent Queues</h2>
            <div className="overflow-x-auto">
              {recentQueues && recentQueues.length > 0 ? (
                <div className="flex space-x-6 pb-4">
                  {recentQueues.map((queue) => (
                    <div key={queue.id} className="flex-shrink-0 w-80">
                      <DynamicQueueCard queue={queue} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#292680] py-8">No recent queues found.</p>
              )}
            </div>
          </div>
        </QueueListErrorBoundary>
      </div>
    </Layout>
  );
}