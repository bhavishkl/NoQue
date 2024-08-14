import { useState } from 'react';
import Layout from '../../components/layout';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import dynamic from 'next/dynamic';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import HomeSkeleton from '../../components/skeletons/HomeSkeleton';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';

const DynamicQueueCard = dynamic(() => import('../../components/QueueCard'), {
  loading: () => <div>Loading queue...</div>,
});

export default function Home({ initialRecentQueues }) {
  const { session, isLoading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentQueues, setRecentQueues] = useState(initialRecentQueues);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/user/queues?search=${encodeURIComponent(searchQuery)}`;
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
        <title>Home</title>
        <meta name="description" content="Manage your queues efficiently with Wique. Search for queue management solutions and view your recent queues." />
        <meta name="keywords" content="queue management, Wique, recent queues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#292680]">Welcome to NoQue</h1>
        
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for queue management solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-[#292680] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6f6cd3]"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#292680]" />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#6f6cd3] text-[#ffffff] rounded-r-md hover:bg-[#3532a7] focus:outline-none focus:ring-2 focus:ring-[#6f6cd3] focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="w-9/12 mb-12 mx-1">
          <h2 className="text-2xl font-bold mb-6 text-[#292680]">Recent Queues</h2>
          <div className="overflow-x-auto">
            {recentQueues && recentQueues.length > 0 ? (
              <div className="flex justify-normal space-x-6 pb-4">
                {recentQueues.map((queue) => (
                  <div key={queue.id} className="flex-shrink-0">
                    <DynamicQueueCard queue={queue} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#292680]">No recent queues found.</p>
            )}
          </div>
        </div>
        
        <div className="mb-12">
          <Link href="/user/queues" className="inline-block px-8 py-3 text-lg font-semibold text-[#ffffff] bg-[#6f6cd3] rounded-md hover:bg-[#3532a7] transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            View All Available Queues
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const supabase = createPagesServerClient(context);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  try {
    const { data: recentQueues, error } = await supabase
      .from('queues')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return {
      props: {
        initialRecentQueues: recentQueues,
      },
    };
  } catch (error) {
    console.error('Error fetching recent queues:', error);
    return {
      props: {
        initialRecentQueues: [],
      },
    };
  }
}