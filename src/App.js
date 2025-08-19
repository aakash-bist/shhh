import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageInput from './components/MessageInput';
import MessageWall from './components/MessageWall';
import DebugPanel from './components/DebugPanel';
import { useMessages } from './hooks/useMessages';

function App() {
  const { messages, isLoading, isSubmitting, publishMessage, clearAllMessages } = useMessages();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePublish = (text) => {
    publishMessage(text);
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Futuristic Dynamic Background */}
      <div className="fixed inset-0 z-0">
        {/* Cyber grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Primary animated gradient - soft tones */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #64748b 0%, #475569 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
              'radial-gradient(circle at 80% 20%, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
              'radial-gradient(circle at 40% 40%, #334155 0%, #475569 25%, #64748b 50%, #0f172a 75%, #1e293b 100%)',
              'radial-gradient(circle at 20% 80%, #64748b 0%, #475569 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 opacity-40"
        />
        
        {/* Soft floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(148, 163, 184, 0.2) 0%, transparent 70%)',
            boxShadow: '0 0 100px rgba(148, 163, 184, 0.3), inset 0 0 50px rgba(148, 163, 184, 0.1)'
          }}
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute top-40 right-20 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(100, 116, 139, 0.2) 0%, transparent 70%)',
            boxShadow: '0 0 100px rgba(100, 116, 139, 0.3), inset 0 0 50px rgba(100, 116, 139, 0.1)'
          }}
        />
        
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
          className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(71, 85, 105, 0.2) 0%, transparent 70%)',
            boxShadow: '0 0 100px rgba(71, 85, 105, 0.3), inset 0 0 50px rgba(71, 85, 105, 0.1)'
          }}
        />
        
        {/* Floating soft particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `rgba(${i % 3 === 0 ? '148, 163, 184' : i % 3 === 1 ? '100, 116, 139' : '71, 85, 105'}, 0.6)`,
              boxShadow: `0 0 ${10 + i * 2}px rgba(${i % 3 === 0 ? '148, 163, 184' : i % 3 === 1 ? '100, 116, 139' : '71, 85, 105'}, 0.4)`,
              left: `${15 + i * 8}%`,
              top: `${25 + i * 6}%`
            }}
          />
        ))}
        
        {/* Subtle scanning line effect */}
        <motion.div
          animate={{
            y: ['-100%', '100%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-40"
        />
        
        {/* Shooting Star Effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`shooting-star-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.6), transparent)',
              boxShadow: '0 0 4px rgba(148, 163, 184, 0.6), 0 0 8px rgba(100, 116, 139, 0.4)',
              filter: 'blur(0.5px)',
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 8)}%`
            }}
            animate={{
              x: [-100, 1200, 1200],
              y: [0, 100, 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + (i * 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3
            }}
          />
        ))}
        
        {/* Diagonal Shooting Stars */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`diagonal-star-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(100, 116, 139, 0.8), rgba(71, 85, 105, 0.6), transparent)',
              boxShadow: '0 0 4px rgba(100, 116, 139, 0.6), 0 0 8px rgba(71, 85, 105, 0.4)',
              filter: 'blur(0.5px)',
              left: `${10 + (i * 20)}%`,
              top: `${20 + (i * 15)}%`
            }}
            animate={{
              x: [-100, 1200, 1200],
              y: [-100, 800, 800],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 6 + (i * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 4 + 2
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
      {/* Debug Panel */}
      <DebugPanel onClearMessages={clearAllMessages} />
      
        {/* Message Wall */}
        <main className="pt-20 pb-32">
          <MessageWall messages={messages} isLoading={isLoading} />
        </main>

        {/* Floating Confess Button */}
        <motion.button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl font-semibold transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #64748b, #475569)',
            boxShadow: '0 8px 32px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(71, 85, 105, 0.2)'
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 12px 40px rgba(71, 85, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          ✨
        </motion.button>

        {/* Confession Input Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed z-50 rounded-2xl shadow-2xl p-5 max-w-md mx-4"
                style={{
                  bottom: '88px',
                  right: '24px',
                  width: 'calc(100vw - 48px)',
                  maxWidth: '400px',
                  background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                  border: '1px solid rgba(71, 85, 105, 0.2)',
                  boxShadow: '0 20px 60px rgba(71, 85, 105, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700">Share Your Confession</h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                    style={{
                      background: 'rgba(71, 85, 105, 0.1)',
                      border: '1px solid rgba(71, 85, 105, 0.2)'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                {/* Textarea */}
                <textarea
                  placeholder="Share your thoughts, confessions, poetry, or anything on your mind..."
                  className="w-full h-28 p-4 rounded-xl resize-none border-0 focus:ring-2 focus:ring-slate-300 focus:outline-none text-slate-800 placeholder-slate-500"
                  style={{
                    background: 'rgba(71, 85, 105, 0.1)',
                    border: '1px solid rgba(71, 85, 105, 0.2)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                />
                
                {/* Publish Button */}
                <motion.button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    const text = textarea?.value || '';
                    if (text.trim()) {
                      handlePublish(text);
                      textarea.value = '';
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    boxShadow: '0 4px 16px rgba(71, 85, 105, 0.3)'
                  }}
                  whileHover={{
                    boxShadow: '0 6px 20px rgba(71, 85, 105, 0.4)'
                  }}
                >
                  Publish Anonymously ✨
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
