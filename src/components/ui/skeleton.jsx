import React from 'react';

export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 w-full max-w-md flex flex-col gap-4">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
  );
}