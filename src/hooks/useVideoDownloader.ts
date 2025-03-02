import { useState } from 'react';
import { TikTokResponse, VideoData } from '../types';
import { formatDuration } from '../utils/format';

interface UseVideoDownloaderReturn {
  videoData: VideoData | null;
  isLoading: boolean;
  error: string;
  downloadingType: string | null;
  fetchVideo: (url: string) => Promise<void>;
  downloadVideo: (url: string, type: string) => Promise<void>;
  resetVideo: () => void;
}

export const useVideoDownloader = (): UseVideoDownloaderReturn => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const fetchVideo = async (url: string): Promise<void> => {
    if (!url.trim()) {
      setError('Please enter a TikTok URL');
      return;
    }
    
    if (!url.includes('tiktok.com')) {
      setError('Please enter a valid TikTok URL');
      return;
    }
    
    setError('');
    setIsLoading(true);
    setVideoData(null); // Reset video data before fetching new data
    
    try {
      const response = await fetch('https://www.tikwm.com/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}&web=1&hd=1`
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video data: ${response.status} ${response.statusText}`);
      }

      const result: TikTokResponse = await response.json();

      if (result.code === 0 && result.data) {
        // Ensure all required data is present
        if (!result.data.cover) {
          throw new Error('Video thumbnail not available');
        }
        
        // Create full URLs for all resources
        const thumbnailUrl = result.data.cover.startsWith('http') 
          ? result.data.cover 
          : `https://www.tikwm.com${result.data.cover}`;
          
        const avatarUrl = result.data.author.avatar.startsWith('http')
          ? result.data.author.avatar
          : `https://www.tikwm.com${result.data.author.avatar}`;
        
        setVideoData({
          thumbnail: thumbnailUrl,
          author: `@${result.data.author.unique_id}`,
          authorNickname: result.data.author.nickname,
          authorAvatar: avatarUrl,
          description: result.data.title,
          duration: formatDuration(result.data.music_info.duration),
          noWatermark: result.data.play.startsWith('http') ? result.data.play : `https://www.tikwm.com${result.data.play}`,
          withWatermark: result.data.wmplay.startsWith('http') ? result.data.wmplay : `https://www.tikwm.com${result.data.wmplay}`,
          audio: result.data.music.startsWith('http') ? result.data.music : `https://www.tikwm.com${result.data.music}`,
          hd: result.data.hdplay && (result.data.hdplay.startsWith('http') ? result.data.hdplay : `https://www.tikwm.com${result.data.hdplay}`)
        });
      } else {
        throw new Error(result.msg || 'Failed to process video');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error fetching video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async (url: string, type: string): Promise<void> => {
    try {
      setDownloadingType(type);
      setError('');
      
      // Validate URL before attempting download
      if (!url || !url.startsWith('http')) {
        throw new Error(`Invalid download URL for ${type}`);
      }
      
      // Determine file extension based on type
      const fileExtension = type === 'audio' ? 'mp3' : 'mp4';
      const fileName = `tiktok-${type}-${Date.now()}.${fileExtension}`;
      
      // Fetch the file with specific headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'identity', // Request without compression
          'Connection': 'keep-alive'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      
      // Get content-type from response
      const contentType = response.headers.get('content-type') || 
        (type === 'audio' ? 'audio/mpeg' : 'video/mp4');
      
      // Create a new response with the proper content type
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': contentType
        }
      });
      
      // Get the blob from the modified response
      const blob = await modifiedResponse.blob();
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
    } catch (error) {
      console.error('Download error:', error);
      setError(error instanceof Error ? error.message : 'Failed to download. Please try again.');
    } finally {
      setDownloadingType(null);
    }
  };

  const resetVideo = (): void => {
    setVideoData(null);
    setError('');
  };

  return {
    videoData,
    isLoading,
    error,
    downloadingType,
    fetchVideo,
    downloadVideo,
    resetVideo
  };
}; 