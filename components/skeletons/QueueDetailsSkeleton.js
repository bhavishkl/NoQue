import React from 'react';

const QueueDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="w-3/4 h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
        <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
        <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="w-full h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};

export default QueueDetailsSkeleton;