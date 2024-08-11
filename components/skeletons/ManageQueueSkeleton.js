import React from 'react';

const ManageQueueSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="w-1/3 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center border-t border-gray-200 p-4">
            <div className="w-1/12 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/12 h-6 bg-gray-200 rounded ml-4 animate-pulse"></div>
            <div className="w-4/12 h-6 bg-gray-200 rounded ml-4 animate-pulse"></div>
            <div className="w-4/12 h-6 bg-gray-200 rounded ml-4 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQueueSkeleton;