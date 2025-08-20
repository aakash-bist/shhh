import { useState, useEffect, useCallback, useMemo } from 'react';

// Performance optimization hook for handling large datasets
export const usePerformance = (data, options = {}) => {
  const {
    pageSize = 24,
    virtualScrollThreshold = 100,
    debounceDelay = 300,
    enableInfiniteScroll = true
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceDelay]);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = data.filter(item => 
        item.text?.toLowerCase().includes(query) ||
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) => 
          (a.timestamp || a.createdAt || 0) - (b.timestamp || b.createdAt || 0)
        );
        break;
      case 'random':
        filtered = [...filtered].sort(() => Math.random() - 0.5);
        break;
      case 'newest':
      default:
        filtered = [...filtered].sort((a, b) => 
          (b.timestamp || b.createdAt || 0) - (a.timestamp || a.createdAt || 0)
        );
        break;
    }

    return filtered;
  }, [data, debouncedQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = processedData.slice(startIndex, endIndex);

  // Virtual scrolling for large datasets
  const shouldUseVirtualScroll = processedData.length > virtualScrollThreshold;
  const virtualScrollHeight = shouldUseVirtualScroll ? processedData.length * 200 : 'auto';

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, sortBy]);

  // Performance-optimized data rendering
  const renderItem = useCallback((item, index, renderFunction) => {
    const globalIndex = startIndex + index;
    
    return renderFunction(item, globalIndex, {
      shouldUseVirtualScroll,
      isVisible: !shouldUseVirtualScroll || (globalIndex >= startIndex && globalIndex < endIndex)
    });
  }, [startIndex, endIndex, shouldUseVirtualScroll]);

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    if (!enableInfiniteScroll || shouldUseVirtualScroll) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    }
  }, [currentPage, totalPages, shouldUseVirtualScroll, enableInfiniteScroll]);

  // Load more function for virtual scrolling
  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
      // Simulate loading delay
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [currentPage, totalPages]);

  // Search and filter functions
  const setSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const setSort = useCallback((sort) => {
    setSortBy(sort);
  }, []);

  const setView = useCallback((view) => {
    setViewMode(view);
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToFirst = useCallback(() => goToPage(1), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);
  const goToNext = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const goToPrevious = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);

  return {
    // Data
    currentData,
    processedData,
    totalPages,
    currentPage,
    
    // State
    searchQuery,
    sortBy,
    viewMode,
    isLoading,
    shouldUseVirtualScroll,
    virtualScrollHeight,
    
    // Functions
    renderItem,
    handleScroll,
    loadMore,
    setSearch,
    setSort,
    setView,
    goToPage,
    goToFirst,
    goToLast,
    goToNext,
    goToPrevious,
    
    // Pagination info
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

// Hook for optimizing animations based on device performance
export const useAnimationOptimization = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Check user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldReduceMotion(prefersReducedMotion);

    // Check device performance
    const checkDevicePerformance = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isLowEnd = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.downlink < 1
      );
      
      // Check for low-end devices
      const isLowEndDevice = isLowEnd || 
        navigator.hardwareConcurrency < 4 || 
        navigator.deviceMemory < 4;
      
      setIsLowEndDevice(isLowEndDevice);
    };

    checkDevicePerformance();
  }, []);

  const getAnimationSettings = useCallback(() => {
    if (shouldReduceMotion || isLowEndDevice) {
      return {
        enabled: false,
        duration: 0.01,
        stagger: 0,
        delay: 0
      };
    }

    return {
      enabled: true,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.15
    };
  }, [shouldReduceMotion, isLowEndDevice]);

  return {
    shouldReduceMotion,
    isLowEndDevice,
    getAnimationSettings
  };
};
