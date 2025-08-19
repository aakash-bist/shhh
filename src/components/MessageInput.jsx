import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MessageInput = ({ onPublish, isSubmitting }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && message.length <= 280) {
      onPublish(message.trim());
      setMessage('');
    }
  };

  const remainingChars = 280 - message.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts, confessions, poetry, or anything on your mind..."
            className="w-full h-32 px-4 py-3 text-gray-800 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200 resize-none focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 placeholder-gray-500"
            maxLength={280}
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {remainingChars}/280
          </div>
        </div>
        
        <motion.button
          type="submit"
          disabled={!message.trim() || message.length > 280 || isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
            !message.trim() || message.length > 280 || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
            />
          ) : (
            'Publish Anonymously ✨'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
