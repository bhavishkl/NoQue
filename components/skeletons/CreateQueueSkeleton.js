import React from 'react';

const CreateQueueSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="w-1/2 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <div className="w-1/4 h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
        <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default CreateQueueSkeleton;