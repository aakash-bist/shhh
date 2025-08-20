// Performance optimization utilities for mobile devices

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Check if device supports reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device is low-end mobile
export const isLowEndMobile = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  return false;
};

// Get optimal animation settings based on device capabilities
export const getAnimationSettings = () => {
  const mobile = isMobile();
  const reducedMotion = prefersReducedMotion();
  const lowEnd = isLowEndMobile();
  
  if (reducedMotion || lowEnd) {
    return {
      enabled: false,
      duration: 0.01,
      stagger: 0,
      delay: 0
    };
  }
  
  if (mobile) {
    return {
      enabled: true,
      duration: 0.3,
      stagger: 0.05,
      delay: 0.05
    };
  }
  
  return {
    enabled: true,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.15
  };
};

// Throttle function for better performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function for better performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
