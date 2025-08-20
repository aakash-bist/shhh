// Storage utility functions - can be easily replaced with Firebase later

const STORAGE_KEY = 'shhh-messages';

export const storageUtils = {
  // Save messages to localStorage
  saveMessages: (messages) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      return true;
    } catch (error) {
      return false;
    }
  },

  // Load messages from localStorage
  loadMessages: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const messages = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  // Clear all messages
  clearMessages: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get storage info
  getStorageInfo: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const size = new Blob([stored]).size;
        return {
          messageCount: JSON.parse(stored).length,
          sizeInBytes: size,
          sizeInKB: (size / 1024).toFixed(2)
        };
      }
      return { messageCount: 0, sizeInBytes: 0, sizeInKB: '0.00' };
    } catch (error) {
      return { messageCount: 0, sizeInBytes: 0, sizeInKB: '0.00' };
    }
  }
};
