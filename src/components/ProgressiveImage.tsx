import React, { useState, useEffect } from 'react';
import { SkeletonLoader } from './SkeletonLoader';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ 
  src, 
  alt, 
  className = '',
  placeholderColor = 'bg-gray-800',
  objectFit = 'cover'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  // Set image source after component mount to enable lazy loading
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    
    // Small delay to ensure skeleton is shown even for cached images
    const timer = setTimeout(() => {
      setImgSrc(src);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [src]);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Determine object-fit class based on prop
  const objectFitClass = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader */}
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center ${placeholderColor}`}>
          <SkeletonLoader className="absolute inset-0" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className={`absolute inset-0 ${placeholderColor} flex items-center justify-center`}>
          <div className="text-red-400 text-sm text-center px-2">
            <svg 
              className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <span className="text-xs sm:text-sm">Failed to load image</span>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      )}
    </div>
  );
}; 