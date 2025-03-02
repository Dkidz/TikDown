import React, { useState, useEffect } from 'react';
import { Download, Loader2, AlertCircle, CheckCircle2, Menu, X } from 'lucide-react';
import { VideoPreview } from './components/VideoPreview';
import { useVideoDownloader } from './hooks/useVideoDownloader';
import { SkeletonLoader } from './components/SkeletonLoader';

function App() {
  const [url, setUrl] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Use custom hooks
  const { 
    videoData, 
    isLoading, 
    error, 
    downloadingType, 
    fetchVideo, 
    downloadVideo, 
    resetVideo 
  } = useVideoDownloader();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchVideo(url);
  };

  const handleReset = () => {
    setUrl('');
    resetVideo();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Render skeleton for video preview when loading
  const renderVideoPreviewSkeleton = () => {
    if (isLoading && !videoData) {
      return (
        <section className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl mb-8 md:mb-12 border border-gray-700">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail skeleton */}
            <div className="w-full md:w-2/5 h-[350px] sm:h-[400px] md:h-[450px] relative">
              <SkeletonLoader className="w-full h-full" />
              
              {/* Author info skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <SkeletonLoader className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                  <div className="space-y-1 sm:space-y-2">
                    <SkeletonLoader className="h-4 sm:h-5 w-24 sm:w-32" />
                    <SkeletonLoader className="h-3 sm:h-4 w-20 sm:w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 md:w-3/5 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
              <div className="mb-4 sm:mb-6">
                <SkeletonLoader className="h-3 sm:h-4 w-full mb-2" />
                <SkeletonLoader className="h-3 sm:h-4 w-full mb-2" />
                <SkeletonLoader className="h-3 sm:h-4 w-3/4" />
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <SkeletonLoader className="h-5 sm:h-6 w-32 sm:w-40 mb-2 sm:mb-4" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonLoader key={index} className="h-14 sm:h-16 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img src="https://i.ibb.co.com/LXBZ64Hc/Desain-tanpa-judul-2.png" alt="TikDown" className="h-6 w-6 md:h-8 md:w-8 text-pink-500" />
            <h1 className="text-xl md:text-2xl font-bold">TikDown</h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">How to Use</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">FAQ</a></li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mt-3 md:hidden animate-fadeIn">
            <ul className="flex flex-col space-y-2 bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 shadow-lg">
              <li><a href="#" className="block py-2 px-3 hover:bg-gray-700/50 rounded-md hover:text-pink-400 transition-colors">Home</a></li>
              <li><a href="#" className="block py-2 px-3 hover:bg-gray-700/50 rounded-md hover:text-pink-400 transition-colors">How to Use</a></li>
              <li><a href="#" className="block py-2 px-3 hover:bg-gray-700/50 rounded-md hover:text-pink-400 transition-colors">FAQ</a></li>
            </ul>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">TikTok Video Downloader</h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8">
            Download TikTok videos without watermark in HD quality. Fast, free, and easy to use!
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste TikTok URL here..."
                  className="w-full pl-10 pr-4 py-3 h-[48px] bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base shadow-md transition-all hover:border-gray-600"
                  aria-label="TikTok video URL"
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label="Clear input"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-70 h-[48px] sm:min-w-[140px] shadow-md hover:shadow-lg transform hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2 w-full sm:w-auto"
              >
  {isLoading ? (
    <>
      <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
      <span>Processing...</span>
    </>
  ) : (
    <>
      <Download className="h-5 w-5 flex-shrink-0" />
      <span>Download</span>
    </>
  )}
</button>
            </div>
            
            {error && (
              <div className="mt-3 text-red-400 flex items-center justify-center gap-1 animate-fadeIn">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </form>
        </section>

        {/* Video Preview Skeleton */}
        {renderVideoPreviewSkeleton()}

        {/* Video Preview Section */}
        {videoData && (
          <VideoPreview
            videoData={videoData}
            downloadingType={downloadingType}
            onDownload={downloadVideo}
            onReset={handleReset}
          />
        )}

        {/* How to Use Section */}
        <section className="max-w-4xl mx-auto mb-8 md:mb-16 animate-fadeIn">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">How to Download TikTok Videos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-pink-500/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold text-pink-500">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Copy Video Link</h3>
              <p className="text-gray-300 text-sm md:text-base">Open TikTok app or website, find the video you want to download and copy its URL.</p>
            </div>
            
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-pink-500/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold text-pink-500">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Paste URL</h3>
              <p className="text-gray-300 text-sm md:text-base">Paste the copied TikTok video URL into the input field above.</p>
            </div>
            
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-pink-500/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold text-pink-500">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Download</h3>
              <p className="text-gray-300 text-sm md:text-base">Click the download button and choose your preferred format to save the video.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mb-8 md:mb-16 animate-fadeIn">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Why Choose TikDown?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg flex items-start gap-3 md:gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-purple-500/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">No Watermark</h3>
                <p className="text-gray-300 text-sm md:text-base">Download TikTok videos without the annoying watermark for clean content.</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg flex items-start gap-3 md:gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-purple-500/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">High Quality</h3>
                <p className="text-gray-300 text-sm md:text-base">Download videos in HD quality to maintain the original video clarity.</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg flex items-start gap-3 md:gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-purple-500/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">Fast & Free</h3>
                <p className="text-gray-300 text-sm md:text-base">Our service is completely free to use with fast download speeds.</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 md:p-6 rounded-lg flex items-start gap-3 md:gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
              <div className="bg-purple-500/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">Multiple Formats</h3>
                <p className="text-gray-300 text-sm md:text-base">Download videos in various formats including MP4 and MP3 audio only.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="https://i.ibb.co.com/LXBZ64Hc/Desain-tanpa-judul-2.png" alt="icon" className="h-5 w-5 md:h-6 md:w-6 text-pink-500" />
              <span className="text-lg md:text-xl font-bold">TikDown</span>
            </div>
            <div className="text-gray-400 text-xs md:text-sm">
              <p>&copy; 2025 TikDown. All rights reserved.</p>
              <p className="mt-1">This service is not affiliated with TikTok.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
