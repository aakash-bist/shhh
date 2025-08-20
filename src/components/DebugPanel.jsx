import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storageUtils } from '../utils/storage';

const DebugPanel = ({ onClearMessages }) => {
  const [storageInfo, setStorageInfo] = useState({ messageCount: 0, sizeInKB: '0.00' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStorageInfo = () => {
      setStorageInfo(storageUtils.getStorageInfo());
    };

    updateStorageInfo();
    // Update storage info every 2 seconds
    const interval = setInterval(updateStorageInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full hover:bg-white/30 transition-all duration-300 z-50"
      >
        🔧 Debug
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-4 left-4 bg-white/10 backdrop-blur-md text-white text-sm p-4 rounded-2xl border border-white/20 z-50 max-w-xs"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Messages:</span>
          <span className="font-mono">{storageInfo.messageCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Storage:</span>
          <span className="font-mono">{storageInfo.sizeInKB} KB</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={onClearMessages}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs py-2 px-3 rounded-lg transition-colors border border-red-500/30"
        >
          🗑️ Clear All Messages
        </button>
        
        <button
          onClick={() => {
            const data = storageUtils.loadMessages();
            alert(`Found ${data.length} messages in localStorage`);
          }}
          className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs py-2 px-3 rounded-lg transition-colors border border-blue-500/30"
        >
          📋 Show Message Count
        </button>
      </div>
      
      <div className="mt-3 text-xs text-white/50 text-center">
        localStorage mode
      </div>
    </motion.div>
  );
};

export default DebugPanel;
