import { useState } from 'react';
import Layout from '../../components/layout';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to QueueMaster</h1>
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search for queue management solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
        <div className="text-center">
          <Link href="/user/queues" className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
            View Available Queues
          </Link>
        </div>
      </div>
    </Layout>
  );
}
