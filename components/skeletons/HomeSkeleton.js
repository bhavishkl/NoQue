import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full h-10 bg-gray-200 rounded mb-8 animate-pulse"></div>
      
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="w-full h-10 bg-gray-200 rounded-l-md animate-pulse"></div>
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded-r-md animate-pulse"></div>
        </div>
      </div>
      
      <div className="w-full mb-12">
        <div className="w-48 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="flex justify-center space-x-6 pb-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-64 h-40 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <div className="w-48 h-12 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
