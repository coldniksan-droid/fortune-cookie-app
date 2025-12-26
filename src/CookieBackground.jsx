import { Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

const CookieBackground = () => {
  // Generate array of cookie positions
  const cookies = [];
  const rows = 8;
  const cols = 6;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      cookies.push({
        id: `${i}-${j}`,
        x: (j * (100 / cols)) + (100 / cols / 2),
        y: (i * (100 / rows)) + (100 / rows / 2),
        delay: (i * cols + j) * 0.1,
        size: 20 + Math.random() * 15,
        rotation: Math.random() * 360,
        opacity: 0.08 + Math.random() * 0.05
      });
    }
  }

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color)'
      }}
    >
      {cookies.map((cookie) => (
        <motion.div
          key={cookie.id}
          className="absolute"
          style={{
            left: `${cookie.x}%`,
            top: `${cookie.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: cookie.opacity
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
            rotate: cookie.rotation
          }}
          animate={{ 
            opacity: cookie.opacity,
            scale: 1,
            rotate: cookie.rotation + 360
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: cookie.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
        >
          <Cookie
            size={cookie.size}
            className="text-amber-600 dark:text-amber-400"
            strokeWidth={1}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default CookieBackground;

