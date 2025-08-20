import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import MessageCard from './MessageCard';

const MessageWall = ({ messages, isLoading }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, random
  const [viewMode, setViewMode] = useState('grid'); // grid, list, masonry

  // Performance constants
  const ITEMS_PER_PAGE = isMobile ? 15 : 24;
  const VIRTUAL_SCROLL_THRESHOLD = 100; // Enable virtual scrolling after 100 items

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Memoized filtered and sorted messages for performance
  const processedMessages = useMemo(() => {
    let filtered = messages;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = messages.filter(msg => 
        msg.text.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'random':
        filtered = [...filtered].sort(() => Math.random() - 0.5);
        break;
      case 'newest':
      default:
        filtered = [...filtered].sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return filtered;
  }, [messages, searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(processedMessages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMessages = processedMessages.slice(startIndex, endIndex);

  // Virtual scrolling for large datasets
  const shouldUseVirtualScroll = processedMessages.length > VIRTUAL_SCROLL_THRESHOLD;
  const virtualScrollHeight = shouldUseVirtualScroll ? processedMessages.length * 200 : 'auto';

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Animation variants - defined before renderMessage function
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.03 : 0.02,
        delayChildren: isMobile ? 0.05 : 0.02
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: isMobile ? 18 : 35,
        stiffness: isMobile ? 180 : 400,
        duration: isMobile ? 0.6 : 0.3
      }
    }
  };

  // Performance-optimized message rendering
  const renderMessage = useCallback((message, index) => {
    const globalIndex = startIndex + index;
    
    return (
      <motion.div
        key={message.id}
        variants={itemVariants}
        className={`relative group ${
          isMobile 
            ? 'w-full' 
            : 'w-full max-w-sm mx-auto'
        }`}
        style={{
          marginBottom: isMobile ? '0' : '0',
          transform: isMobile 
            ? 'none' 
            : `rotate(${((globalIndex % 3) - 1) * 0.5}deg)`
        }}
        // Performance optimization: only animate visible items
        initial={shouldUseVirtualScroll ? false : "hidden"}
        whileInView={shouldUseVirtualScroll ? {} : "visible"}
        viewport={{ once: true, margin: "100px" }}
      >
        <MessageCard 
          message={message} 
          index={globalIndex}
          isMobile={isMobile}
        />
      </motion.div>
    );
  }, [startIndex, isMobile, shouldUseVirtualScroll]);

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    if (shouldUseVirtualScroll) return; // Disable infinite scroll for virtual scrolling
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    }
  }, [currentPage, totalPages, shouldUseVirtualScroll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        {!isMobile ? (
                  <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full relative"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)'
          }}
        />
        ) : (
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full relative animate-spin" />
        )}
        <motion.div
          animate={!isMobile ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="ml-6 text-cyan-400 text-xl font-bold"
          style={{
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
          }}
        >
          Loading confessions...
        </motion.div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 text-cyan-400"
      >
        <motion.div
          animate={!isMobile ? { 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-8xl mb-6"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))'
          }}
        >
          💭
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-4 text-cyan-300"
          style={{
            textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
          }}
        >
          Be the first to share
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyan-300 text-lg mb-6"
        >
          Your anonymous message will appear here
        </motion.p>
        
        <motion.div
          animate={!isMobile ? { 
            y: [0, -3, 0],
            opacity: [0.6, 1, 0.6]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-5xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))'
          }}
        >
          ✨
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background ambient effects - only on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, transparent 70%)',
              boxShadow: '0 0 80px rgba(148, 163, 184, 0.25), inset 0 0 40px rgba(148, 163, 184, 0.08)'
            }}
          />
          
          <motion.div
            animate={{ 
              x: [0, -50, 0],
              y: [0, 40, 0],
              opacity: [0.1, 0.35, 0.1],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(100, 116, 139, 0.15) 0%, transparent 70%)',
              boxShadow: '0 0 80px rgba(100, 116, 139, 0.25), inset 0 0 40px rgba(100, 116, 139, 0.08)'
            }}
          />
          
          <motion.div
            animate={{ 
              y: [0, 25, 0],
              x: [0, 20, 0],
              opacity: [0.08, 0.25, 0.08],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(139, 92, 139, 0.06)'
            }}
          />
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="sticky top-0 z-30 backdrop-blur-sm border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Futuristic Search Bar */}
            <div className="relative flex-1 max-w-md group">
              <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isMobile ? 'hidden' : ''}`}></div>
              <div className="relative border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm bg-transparent">
                <input
                  type="text"
                  placeholder="Search confessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 bg-transparent text-white placeholder-cyan-300/60 focus:outline-none focus:ring-0 text-sm font-medium tracking-wide relative z-10"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="w-7 h-7 flex items-center justify-center text-cyan-300 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-sm rounded-full border border-cyan-400/50 hover:border-cyan-300 hover:bg-slate-700/80 hover:scale-110 shadow-lg"
                      type="button"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  ) : (
                    <div className="w-7 h-7 flex items-center justify-center text-cyan-400">
                      <div className={`absolute inset-0 bg-cyan-400/20 rounded-full ${isMobile ? 'hidden' : 'animate-pulse'}`}></div>
                      <div className="relative z-10">🔍</div>
                    </div>
                  )}
                </div>
                {/* Animated border glow - only on desktop */}
                <div className={`absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isMobile ? 'hidden' : ''}`}></div>
              </div>
            </div>

            {/* Futuristic Control Panel */}
            <div className="flex gap-3">
              {/* Sort Control */}
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isMobile ? 'hidden' : ''}`}></div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`relative px-4 py-2.5 backdrop-blur-sm border rounded-xl text-white text-sm font-medium focus:outline-none cursor-pointer transition-all duration-150 shadow-lg ${
                    isMobile 
                      ? 'bg-slate-800/30 border-slate-600/40 focus:ring-1 focus:ring-slate-500/50 focus:border-slate-500/50 hover:border-slate-500/40' 
                      : 'bg-transparent border-purple-500/20 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 hover:border-purple-400/30'
                  }`}
                >
                  <option value="newest" className="bg-slate-800 text-white">🕐 Newest First</option>
                  <option value="oldest" className="bg-slate-800 text-white">⏰ Oldest First</option>
                  <option value="random" className="bg-slate-800 text-white">🎲 Random</option>
                </select>
              </div>

              {/* View Mode Control */}
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isMobile ? 'hidden' : ''}`}></div>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className={`relative px-4 py-2.5 backdrop-blur-sm border rounded-xl text-white text-sm font-medium focus:outline-none cursor-pointer transition-all duration-150 shadow-lg ${
                    isMobile 
                      ? 'bg-slate-800/30 border-slate-600/40 focus:ring-1 focus:ring-slate-500/50 focus:border-slate-500/50 hover:border-slate-500/40' 
                      : 'bg-transparent border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 hover:border-blue-400/30'
                  }`}
                >
                  <option value="grid" className="bg-slate-800 text-white">⊞ Grid</option>
                  <option value="list" className="bg-slate-800 text-white">☰ List</option>
                  <option value="masonry" className="bg-slate-800 text-white">◊ Masonry</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Active Filters Indicator */}
          {(sortBy !== 'newest' || viewMode !== 'grid') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start items-center"
            >
              {/* Sort Filter */}
              {sortBy !== 'newest' && (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-medium backdrop-blur-sm ${
                  isMobile 
                    ? 'bg-slate-700/40 border-slate-600/50 text-slate-200' 
                    : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                }`}>
                  {sortBy === 'oldest' ? '⏰ Oldest First' : '🎲 Random Order'}
                  <button
                    onClick={() => setSortBy('newest')}
                    className="ml-1 hover:text-purple-200 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
              
              {/* View Mode Filter */}
              {viewMode !== 'grid' && (
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-medium backdrop-blur-sm ${
                  isMobile 
                    ? 'bg-slate-700/40 border-slate-600/50 text-slate-200' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}>
                  {viewMode === 'list' ? '☰ List View' : '◊ Masonry View'}
                  <button
                    onClick={() => setViewMode('grid')}
                    className="ml-1 hover:text-blue-200 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
              
              {/* Clear All Filters Button */}
              {(sortBy !== 'newest' || viewMode !== 'grid') && (
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setViewMode('grid');
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-150 hover:scale-105 ${
                    isMobile 
                      ? 'bg-red-600/40 border-red-500/50 text-red-200 hover:bg-red-600/60' 
                      : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                  }`}
                >
                  🗑️ Clear All
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Futuristic message count indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8 mt-6"
      >
        <motion.div
          animate={{ 
            scale: isScrolling ? 1.05 : 1,
            y: isScrolling ? -2 : 0
          }}
          transition={{ duration: 0.15 }}
          className="inline-block relative"
        >
          <motion.span 
            animate={!isMobile ? { opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan-300 text-sm md:text-base font-semibold tracking-wider px-4 py-2 rounded-full bg-slate-800/20 backdrop-blur-sm border border-cyan-500/30"
            style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.6)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
            }}
          >
            {processedMessages.length} of {messages.length} confessions
            {searchQuery && ` matching "${searchQuery}"`}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Performance Info */}
      {shouldUseVirtualScroll && (
        <div className="text-center mb-4">
          <span className="text-xs text-slate-400 bg-slate-800/30 px-3 py-1 rounded-full">
            🚀 Virtual scrolling enabled for {processedMessages.length} items
          </span>
        </div>
      )}

      {/* Show "No search results" message when search doesn't match any records */}
      {searchQuery && processedMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-cyan-400"
        >
          <motion.div
            animate={!isMobile ? { 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-6"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))'
            }}
          >
            🔍
        </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4 text-cyan-300"
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
            }}
          >
            No confessions found
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="cyan-300 text-lg mb-6"
          >
            Try adjusting your search terms
          </motion.p>
          
          <motion.div
            animate={!isMobile ? { 
              y: [0, -3, 0],
              opacity: [0.6, 1, 0.6]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-5xl"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))'
            }}
          >
            ✨
          </motion.div>
        </motion.div>
      ) : (
        /* Dynamic messages grid with futuristic animations */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 md:px-6 lg:px-8 pb-20"
        >
          {/* Responsive grid layout */}
          <div 
            className={`
              ${isMobile 
                ? 'space-y-4' // Stack on mobile with consistent spacing
                : viewMode === 'list' 
                  ? 'space-y-4 max-w-2xl mx-auto'
                  : viewMode === 'masonry'
                    ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6'
              }
            `}
            style={{ minHeight: shouldUseVirtualScroll ? virtualScrollHeight : 'auto' }}
            onScroll={handleScroll}
          >
            {currentMessages.map((message, index) => renderMessage(message, index))}
          </div>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !shouldUseVirtualScroll && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
          >
            First
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 bg-slate-800/30 border border-slate-600/30 rounded-lg text-white text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
          >
            Next
          </button>
          
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50"
          >
            Last
          </button>
        </div>
      )}

      {/* Load More Button for Virtual Scrolling */}
      {shouldUseVirtualScroll && currentPage < totalPages && (
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-150"
          >
            Load More Confessions ({processedMessages.length} of {messages.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageWall;
