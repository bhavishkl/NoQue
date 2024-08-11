import React from 'react';

const QueueDashboardSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="w-1/3 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="flex justify-between items-center">
              <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="inline-block w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default QueueDashboardSkeleton;