import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/4 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        </div>
        <div className="md:w-2/3">
          <div className="space-y-4">
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="w-1/3 h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;