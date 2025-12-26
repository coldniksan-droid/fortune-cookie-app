import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

const MysticalCardBackground = () => {
  // Generate stars
  const stars = [];
  for (let i = 0; i < 15; i++) {
    stars.push({
      id: `star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 2
    });
  }

  // Generate sparkles
  const sparkles = [];
  for (let i = 0; i < 8; i++) {
    sparkles.push({
      id: `sparkle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 4 + Math.random() * 6
    });
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 rounded-2xl" />
      
      {/* Gradient background */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 25%, rgba(59, 130, 246, 0.3) 50%, rgba(168, 85, 247, 0.4) 75%, rgba(99, 102, 241, 0.4) 100%)',
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0, 1, 0.8, 1, 0]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Star
            size={star.size}
            className="text-yellow-300 fill-yellow-300"
            strokeWidth={1}
          />
        </motion.div>
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Sparkles
            size={sparkle.size}
            className="text-purple-300"
            strokeWidth={1.5}
          />
        </motion.div>
      ))}

      {/* Mystical border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(99, 102, 241, 0.2)'
        }}
        animate={{
          boxShadow: [
            'inset 0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(99, 102, 241, 0.2)',
            'inset 0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 70px rgba(139, 92, 246, 0.2)',
            'inset 0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(99, 102, 241, 0.2)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default MysticalCardBackground;

