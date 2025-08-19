import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';

const MessageWall = ({ messages, isLoading }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full relative"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)'
          }}
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
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
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
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
          className="text-cyan-300 text-lg mb-6"
        >
          Your anonymous message will appear here
        </motion.p>
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity }}
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative">
      {/* Enhanced futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Enhanced soft orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, transparent 70%)',
            boxShadow: '0 0 80px rgba(148, 163, 184, 0.25), inset 0 0 40px rgba(148, 163, 184, 0.08)'
          }}
        />
        
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.1, 0.35, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-40 right-20 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.15) 0%, transparent 70%)',
            boxShadow: '0 0 80px rgba(100, 116, 139, 0.25), inset 0 0 40px rgba(100, 116, 139, 0.08)'
          }}
        />
        
        <motion.div
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute bottom-40 left-1/4 w-28 h-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(71, 85, 105, 0.15) 0%, transparent 70%)',
            boxShadow: '0 0 80px rgba(71, 85, 105, 0.25), inset 0 0 40px rgba(71, 85, 105, 0.08)'
          }}
        />
        
        {/* Enhanced floating soft particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.4, 1.2, 0.4]
            }}
            transition={{
              duration: 18 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 4)}px`,
              height: `${3 + (i % 4)}px`,
              background: `rgba(${i % 4 === 0 ? '148, 163, 184' : i % 4 === 1 ? '100, 116, 139' : i % 4 === 2 ? '71, 85, 105' : '51, 65, 85'}, 0.7)`,
              boxShadow: `0 0 ${15 + i * 3}px rgba(${i % 4 === 0 ? '148, 163, 184' : i % 4 === 1 ? '100, 116, 139' : i % 4 === 2 ? '71, 85, 105' : '51, 65, 85'}, 0.5)`,
              left: `${10 + i * 6}%`,
              top: `${20 + i * 5}%`
            }}
          />
        ))}
      </div>

      {/* Futuristic message count indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <motion.div
          animate={{ 
            scale: isScrolling ? 1.1 : 1,
            y: isScrolling ? -3 : 0
          }}
          transition={{ duration: 0.3 }}
          className="inline-block relative"
        >
          <motion.span 
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-cyan-300 text-sm font-medium tracking-wider"
            style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
            }}
          >
            {messages.length} anonymous {messages.length === 1 ? 'confession' : 'confessions'}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Dynamic messages grid with futuristic animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((message, index) => (
            <motion.div
              key={message.id}
              variants={itemVariants}
              layout
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: -20,
                transition: { duration: 0.3 }
              }}
              className="break-inside-avoid mb-6"
            >
              <MessageCard 
                message={message} 
                index={index}
                isScrolling={isScrolling}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Enhanced futuristic scroll-to-top button */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          scale: isScrolling ? 1.15 : 1,
          rotate: isScrolling ? 8 : 0
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.3 },
          rotate: { duration: 0.3 }
        }}
        whileHover={{ scale: 1.3, y: -8 }}
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full cursor-pointer z-50 group"
        style={{
          background: '#475569',
          boxShadow: '0 4px 20px rgba(71, 85, 105, 0.4)'
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center text-white text-xl font-bold relative"
        >
          ↑
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               style={{
                 boxShadow: '0 0 25px rgba(71, 85, 105, 0.6)'
               }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MessageWall;
