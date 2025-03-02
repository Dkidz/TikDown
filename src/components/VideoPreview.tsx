import React, { useState, useEffect } from 'react';
import { FileVideo, Loader2 } from 'lucide-react';
import { VideoData } from '../types';
import { ProgressiveImage } from './ProgressiveImage';

interface VideoPreviewProps {
  videoData: VideoData;
  downloadingType: string | null;
  onDownload: (url: string, type: string) => void;
  onReset: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoData,
  downloadingType,
  onDownload,
  onReset
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Helper function to ensure URLs are complete
  const getFullUrl = (path: string): string => {
    if (!path) return '';
    return path.startsWith('http') ? path : `https://www.tikwm.com${path}`;
  };

  // Add animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className={`max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl mb-8 md:mb-12 border border-gray-700 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail container */}
        <div className="w-full md:w-2/5 h-[400px] md:h-[450px] relative bg-gray-900">
          {/* Cover image */}
          <div className="absolute inset-0">
            <ProgressiveImage
              src={getFullUrl(videoData.thumbnail)}
              alt="Video thumbnail"
              className="w-full h-full"
              objectFit="cover"
            />
            
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
          </div>
          
          {/* Author info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
            <div className="flex items-center gap-3">
              <ProgressiveImage 
                src={getFullUrl(videoData.authorAvatar)}
                alt={videoData.authorNickname}
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-white drop-shadow-md">{videoData.author}</h3>
                <p className="text-sm text-gray-200/90">{videoData.authorNickname}</p>
              </div>
            </div>
          </div>
          
          {/* Duration badge */}
          {videoData.duration && (
            <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-gray-700/50 shadow-md">
              {videoData.duration}
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 md:w-3/5 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
          <div className="mb-6">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">{videoData.description}</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-base md:text-lg text-white/90">Download Options:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => videoData.noWatermark && onDownload(videoData.noWatermark, 'no-watermark')}
                disabled={downloadingType === 'no-watermark'}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 transition-all p-4 rounded-xl backdrop-blur-sm border border-gray-600/30 disabled:opacity-50 hover:shadow-lg hover:border-gray-500/50 group h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <FileVideo className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm md:text-base font-medium">No Watermark</span>
                </div>
                {downloadingType === 'no-watermark' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
                ) : (
                  <span className="text-xs font-medium bg-gray-600/70 px-2.5 py-1.5 rounded-full group-hover:bg-gray-500/70 transition-colors flex items-center">MP4</span>
                )}
              </button>
              
              <button 
                onClick={() => videoData.withWatermark && onDownload(videoData.withWatermark, 'with-watermark')}
                disabled={downloadingType === 'with-watermark'}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 transition-all p-4 rounded-xl backdrop-blur-sm border border-gray-600/30 disabled:opacity-50 hover:shadow-lg hover:border-gray-500/50 group h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <FileVideo className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm md:text-base font-medium">With Watermark</span>
                </div>
                {downloadingType === 'with-watermark' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
                ) : (
                  <span className="text-xs font-medium bg-gray-600/70 px-2.5 py-1.5 rounded-full group-hover:bg-gray-500/70 transition-colors flex items-center">MP4</span>
                )}
              </button>
              
              <button 
                onClick={() => videoData.audio && onDownload(videoData.audio, 'audio')}
                disabled={downloadingType === 'audio'}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 transition-all p-4 rounded-xl backdrop-blur-sm border border-gray-600/30 disabled:opacity-50 hover:shadow-lg hover:border-gray-500/50 group h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <FileVideo className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm md:text-base font-medium">Audio Only</span>
                </div>
                {downloadingType === 'audio' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
                ) : (
                  <span className="text-xs font-medium bg-gray-600/70 px-2.5 py-1.5 rounded-full group-hover:bg-gray-500/70 transition-colors flex items-center">MP3</span>
                )}
              </button>
              
              <button 
                onClick={() => videoData.hd && onDownload(videoData.hd, 'hd')}
                disabled={downloadingType === 'hd'}
                className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 transition-all p-4 rounded-xl backdrop-blur-sm border border-gray-600/30 disabled:opacity-50 hover:shadow-lg hover:border-gray-500/50 group h-[56px]"
              >
                <div className="flex items-center gap-3">
                  <FileVideo className="h-5 w-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm md:text-base font-medium">No Watermark HD</span>
                </div>
                {downloadingType === 'hd' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
                ) : (
                  <span className="text-xs font-medium bg-gray-600/70 px-2.5 py-1.5 rounded-full group-hover:bg-gray-500/70 transition-colors flex items-center">MP4</span>
                )}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onReset}
            className="mt-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2 min-h-[44px] group"
            aria-label="Download another video"
          >
            <span className="group-hover:underline">Download another video</span>
          </button>
        </div>
      </div>
    </section>
  );
}; 