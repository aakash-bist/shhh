import React from 'react';
import { motion } from 'framer-motion';

const MessageCard = ({ message, index, isMobile }) => {
  // Consistent neutral color scheme for all cards
  const colorScheme = {
    bg: 'from-slate-200/95 via-slate-100/90 to-slate-50/85',
    border: 'border-slate-300/70',
    accent: '#475569',
    shadow: 'rgba(71, 85, 105, 0.2)',
    pattern: 'from-slate-300/20 to-slate-200/20',
    glow: 'rgba(71, 85, 105, 0.4)'
  };
  
  // Dynamic rotation and positioning
  const baseRotation = ((message.text.charCodeAt(0) + index) % 4) - 2; // -2 to +2 degrees
  
  // Message length affects card height and styling
  const isLongMessage = message.text.length > 150;
  const isShortMessage = message.text.length < 50;
  
  // Enhanced floating animation with cyber effects - only on desktop
  const floatingAnimation = {
    y: [0, -6, 0],
    rotate: [baseRotation, baseRotation + 0.3, baseRotation],
    scale: [1, 1.015, 1]
  };
  
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    
    // Handle both Date objects (localStorage) and Firestore timestamps (Firebase)
    let messageDate;
    if (timestamp && typeof timestamp.toDate === 'function') {
      // Firestore timestamp
      messageDate = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // Regular Date object (localStorage)
      messageDate = timestamp;
    } else {
      // Fallback: try to create Date from timestamp
      messageDate = new Date(timestamp);
    }
    
    // Check if messageDate is valid
    if (isNaN(messageDate.getTime())) {
      return 'Unknown time';
    }
    
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return messageDate.toLocaleDateString();
  };

  // Secretive emoji selection for anonymous confessions
  const getSecretiveEmoji = () => {
    const secretiveEmojis = ['🤫', '🤐', '🙊', '🤭', '😶', '😐', '😑', '😯', '😲', '😱', '😨', '😰', '😥', '😢', '😭', '😤', '😪', '😴', '😵', '😵‍💫', '🥴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😈', '👿', '👹', '👺', '💀', '☠️', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '🐵', '🐒', '🦍'];
    const emojiIndex = (message.text.charCodeAt(0) + message.text.length + index) % secretiveEmojis.length;
    return secretiveEmojis[emojiIndex];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: baseRotation, y: 20 }}
      animate={{ 
        opacity: 1, // Cards are always visible
        scale: 1, 
        rotate: baseRotation,
        y: 0
      }}
      // Enhanced floating animation with cyber effects - only on desktop
      whileInView={!isMobile ? {
        ...floatingAnimation,
        transition: {
          duration: 4 + (index % 3) * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: (index % 4) * 0.3
        }
      } : {}}
      transition={{ 
        duration: isMobile ? 0.4 : 0.8, 
        delay: isMobile ? index * 0.05 : index * 0.15,
        type: "spring",
        stiffness: isMobile ? 100 : 80,
        damping: isMobile ? 25 : 20
      }}
      className={`bg-gradient-to-br ${colorScheme.bg} ${colorScheme.border} p-4 md:p-6 rounded-2xl md:rounded-3xl transform transition-all duration-500 relative overflow-hidden group border backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]`}
      style={{
        minHeight: isShortMessage ? '100px' : isLongMessage ? '180px' : '140px',
        maxWidth: isMobile ? '100%' : '320px',
        width: '100%',
        wordBreak: 'break-word',
        boxShadow: `0 4px 20px ${colorScheme.shadow}, 0 0 40px ${colorScheme.glow}15, inset 0 0 15px ${colorScheme.glow}08`,
        opacity: 1,
        transition: 'all 0.4s ease-in-out',
        // Add subtle border glow on hover
        borderColor: 'rgba(71, 85, 105, 0.3)',
        // Ensure cards don't overlap
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Animated cyber border */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 rounded-3xl opacity-30"
        style={{
          background: `linear-gradient(45deg, ${colorScheme.accent}, transparent, ${colorScheme.accent}, transparent, ${colorScheme.accent})`,
          backgroundSize: '400% 400%'
        }}
      />

      {/* Futuristic background pattern */}
      {!isMobile && (
        <motion.div
          animate={{ 
            rotate: 0,
            scale: 1,
            opacity: 0.08
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colorScheme.pattern})`,
            borderRadius: '50%'
          }}
        />
      )}


      {/* Message content with improved readability */}
      <div className="relative z-10">
        <motion.div 
          className="text-slate-900 leading-relaxed font-medium md:font-semibold text-sm md:text-base tracking-wide"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: '1.6',
            textShadow: `0 0 1px rgba(0, 0, 0, 0.1)`
          }}
        >
          {message.text}
        </motion.div>
        
        {/* Improved timestamp and metadata readability */}
        <motion.div 
          className="mt-4 md:mt-5 pt-3 md:pt-4"
          style={{
            borderTop: `1px solid ${colorScheme.accent}25`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.span 
                className="text-base md:text-lg"
                style={{
                  filter: `drop-shadow(0 0 3px ${colorScheme.glow})`
                }}
              >
                {getSecretiveEmoji()}
              </motion.span>
              <span className="text-xs md:text-sm text-slate-700 font-medium md:font-semibold tracking-wide"
                    style={{
                      textShadow: `0 0 1px rgba(0, 0, 0, 0.1)`
                    }}>
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <motion.span 
              className="text-xs md:text-sm font-bold tracking-wider opacity-80 text-slate-600"
              style={{
                textShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
                background: 'rgba(71, 85, 105, 0.1)',
                padding: '2px 6px',
                borderRadius: '8px',
                border: '1px solid rgba(71, 85, 105, 0.2)'
              }}
            >
              #{String(index + 1).padStart(3, '0')}
            </motion.span>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced soft decorative elements */}
      <motion.div
        animate={{ 
          scale: 1,
          opacity: 0.3
        }}
        transition={{ duration: 0.4 }}
        className="absolute top-4 right-4 w-3 h-3 rounded-full backdrop-blur-sm"
        style={{
          background: `${colorScheme.accent}60`,
          boxShadow: `0 0 10px ${colorScheme.glow}`
        }}
      />
      <motion.div
        animate={{ 
          scale: 1,
          opacity: 0.25
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-4 left-4 w-2 h-2 rounded-full backdrop-blur-sm"
        style={{
          background: `${colorScheme.accent}50`,
          boxShadow: `0 0 8px ${colorScheme.glow}`
        }}
      />
      
      {/* Enhanced hover effect overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        className="absolute inset-0 rounded-2xl md:rounded-3xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.accent}20, transparent)`,
          pointerEvents: 'none'
        }}
      />

      {/* Futuristic bottom accent line */}
      <motion.div
        animate={{ 
          scaleX: 0.8,
          opacity: 0.4
        }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorScheme.accent}, transparent)`,
          boxShadow: `0 0 8px ${colorScheme.glow}`
        }}
      />

      {/* Floating soft quote mark */}
      <motion.div
        animate={{ 
          opacity: 0.15,
          y: 0,
          scale: 1
        }}
        transition={{ duration: 0.4 }}
        className="absolute top-2 md:top-3 left-2 md:left-3 text-xl md:text-2xl font-serif"
        style={{ 
          fontFamily: 'Georgia, serif',
          color: colorScheme.accent,
          textShadow: `0 0 8px ${colorScheme.glow}`,
          filter: `drop-shadow(0 0 4px ${colorScheme.glow})`
        }}
      >
        "
      </motion.div>
    </motion.div>
  );
};

export default MessageCard;

