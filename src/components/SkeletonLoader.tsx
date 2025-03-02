import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}; 