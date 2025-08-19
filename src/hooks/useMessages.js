import { useState, useEffect } from 'react';
import { 
  ref, 
  push, 
  get, 
  query, 
  orderByChild, 
  onValue,
  remove,
  serverTimestamp 
} from 'firebase/database';
import { db } from '../firebase';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load messages from Realtime Database on component mount
  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const q = query(messagesRef, orderByChild('timestamp'));

    // Set up real-time listener
    const unsubscribe = onValue(q, (snapshot) => {
      const messagesData = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messagesData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        // Sort by timestamp (newest first)
        messagesData.sort((a, b) => b.timestamp - a.timestamp);
      }
      setMessages(messagesData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading messages:', error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const publishMessage = async (text) => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Create new message object
      const newMessage = {
        text: text.trim(),
        timestamp: Date.now() // Use current timestamp for RTDB
      };

      // Add to Realtime Database
      const messagesRef = ref(db, 'messages');
      const newMessageRef = await push(messagesRef, newMessage);
      console.log('Message published with ID:', newMessageRef.key);
      
    } catch (error) {
      console.error('Error publishing message:', error);
      alert('Failed to publish message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clear all messages (useful for testing)
  const clearAllMessages = async () => {
    if (window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      try {
        // Delete all messages from Realtime Database
        const messagesRef = ref(db, 'messages');
        await remove(messagesRef);
        console.log('All messages cleared');
      } catch (error) {
        console.error('Error clearing messages:', error);
        alert('Failed to clear messages. Please try again.');
      }
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
