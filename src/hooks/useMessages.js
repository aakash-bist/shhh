import { useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        const storedMessages = storageUtils.loadMessages();
        setMessages(storedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading delay for better UX
    setTimeout(loadMessages, 500);
  }, []);

  const publishMessage = async (text) => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Create new message object
      const newMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: text.trim(),
        timestamp: new Date()
      };

      // Add to local state
      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);

      // Save to localStorage
      storageUtils.saveMessages(updatedMessages);

      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error publishing message:', error);
      alert('Failed to publish message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clear all messages (useful for testing)
  const clearAllMessages = () => {
    if (window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      storageUtils.clearMessages();
      setMessages([]);
    }
  };

  return {
    messages,
    isLoading,
    isSubmitting,
    publishMessage,
    clearAllMessages
  };
};
