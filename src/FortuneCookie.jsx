import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Audio for cookie crunch sound - создаем внутри компонента для правильной работы
const createAudio = (src, volume = 0.5) => {
  if (typeof window === 'undefined') return null;
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';
    // Предзагрузка звука
    audio.load();
    return audio;
  } catch (e) {
    console.log('Audio creation failed:', e);
    return null;
  }
};

const FortuneCookie = ({ onOpen, isOpening, adController }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const [showPaper, setShowPaper] = useState(false);
  const [useImage, setUseImage] = useState(false); // Start with false, will check if image exists
  const imgRef = useRef(null);
  
  // Audio refs для звуков
  const crunchAudioRef = useRef(null);
  const tapAudioRef = useRef(null);

  // Check if Telegram WebApp is available
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp;

  // Инициализация звуков
  useEffect(() => {
    crunchAudioRef.current = createAudio('/crunch.mp3', 0.6); // Звук хруста при разламывании
    tapAudioRef.current = createAudio('/crunch.mp3', 0.2); // Тихий звук для первых тапов
  }, []);

  // Check if image exists on mount - try different formats
  useEffect(() => {
    const checkImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
    };

    const checkImages = async () => {
      // Try different formats and names, including the user's image
      const imagePaths = [
        '/Gemini_Generated_Image_p66mc0p66mc0p66m.gif',
        '/photo_2025-12-26_15-05-26.jpg',
        '/fortune-cookie.png',
        '/fortune-cookie.jpg',
        '/fortune-cookie.jpeg',
        '/fortune-cookie.webp',
        '/cookie.png',
        '/cookie.jpg'
      ];

      for (const path of imagePaths) {
        const exists = await checkImage(path);
        if (exists) {
          setUseImage(true);
          // Update the src in the component
          if (imgRef.current) {
            imgRef.current.src = path;
          }
          return;
        }
      }
      setUseImage(false);
    };

    checkImages();
  }, []);

  // Reset states when not opening
  useEffect(() => {
    if (!isOpening) {
      setIsBroken(false);
      setTapCount(0);
      setShowPaper(false);
    }
  }, [isOpening]);

  const breathingAnimation = {
    scale: [1, 1.05, 1],
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Shake animation that intensifies with tap count
  const getShakeAnimation = (count) => {
    const intensity = count * 3;
    return {
      x: [0, -intensity, intensity, -intensity, intensity, -intensity/2, intensity/2, 0],
      y: [0, -intensity/2, intensity/2, -intensity/2, intensity/2, 0, 0, 0],
      rotate: [0, -intensity/2, intensity/2, -intensity/2, intensity/2, -intensity/4, intensity/4, 0],
      transition: {
        duration: 0.4 + (count * 0.1),
        ease: "easeOut"
      }
    };
  };

  const handleClick = () => {
    if (isBroken || isOpening) return;

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Haptic feedback
    if (isTelegramWebApp) {
      try {
        if (newTapCount < 3) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        } else {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
      } catch (error) {
        console.log('Haptic feedback not available:', error);
      }
    }

    // Звук для первых двух тапов (тихий)
    if (newTapCount < 3 && tapAudioRef.current) {
      try {
        tapAudioRef.current.currentTime = 0;
        tapAudioRef.current.play().catch(e => {
          console.log("Tap audio play failed:", e);
        });
      } catch (e) {
        console.log("Tap audio error:", e);
      }
    }

    // On 3rd tap, open the cookie
    if (newTapCount >= 3) {
      // Play crunch sound (громкий хруст)
      if (crunchAudioRef.current) {
        try {
          crunchAudioRef.current.currentTime = 0; // Reset to start
          crunchAudioRef.current.volume = 0.6; // Убедимся, что громкость правильная
          crunchAudioRef.current.play().catch(e => {
            console.log("Crunch audio play failed:", e);
          });
        } catch (e) {
          console.log("Crunch audio error:", e);
        }
      }
      
      setIsBroken(true);
      
      // Show paper and call onOpen (ad is now handled in App.jsx handleCookieClick before opening)
      setShowPaper(true);
      setTimeout(() => {
        onOpen();
      }, 500);
    }
  };


  // Paper slip component - realistic paper fortune
  const PaperSlip = () => (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0, scale: 0, rotateY: 90 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0
      }}
      transition={{
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: '160px',
          minHeight: '80px',
        }}
        initial={{ scaleY: 0.1, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.4,
          ease: "easeOut"
        }}
      >
        {/* Paper texture background */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: `
              linear-gradient(90deg, rgba(250, 250, 250, 0.8) 0%, rgba(255, 255, 255, 1) 50%, rgba(250, 250, 250, 0.8) 100%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.03) 2px,
                rgba(0, 0, 0, 0.03) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.02) 2px,
                rgba(0, 0, 0, 0.02) 4px
              )
            `,
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.15),
              0 0 1px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.9),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05)
            `,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '12px 16px'
          }}
        >
          {/* Fold lines (characteristic of fortune cookie paper) */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
              top: '8px'
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
              bottom: '8px'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 text-xs text-gray-800 text-center leading-tight font-medium">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              ✨
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      className="flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={!isBroken && !isOpening ? breathingAnimation : {}}
      style={{
        perspective: '1000px'
      }}
    >
      <div className="relative" style={{ width: '350px', height: '350px' }}>
        {/* Shadow */}
        {!isBroken && (
          <motion.svg
            width="350"
            height="350"
            viewBox="0 0 350 350"
            className="absolute"
            style={{ left: 0, top: 0, pointerEvents: 'none' }}
            animate={tapCount > 0 ? getShakeAnimation(tapCount) : {}}
          >
            <ellipse
              cx="175"
              cy="300"
              rx="100"
              ry="30"
              fill="rgba(100, 150, 120, 0.25)"
            />
          </motion.svg>
        )}

        {/* Cookie image */}
        <AnimatePresence>
          {!isBroken && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={tapCount > 0 ? getShakeAnimation(tapCount) : {}}
              exit={{ 
                opacity: 0, 
                scale: 0.8,
                rotate: 360
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut"
              }}
            >
              {useImage ? (
                <motion.img
                  ref={imgRef}
                  src="/Gemini_Generated_Image_p66mc0p66mc0p66m.gif"
                  alt="Fortune Cookie"
                  className="cookie-image-no-bg w-full h-full object-contain"
                  style={{
                    width: '350px',
                    height: '350px',
                    objectFit: 'contain'
                  }}
                  onError={() => {
                    // If image fails to load, switch to SVG
                    console.log('Image failed to load, using SVG fallback');
                    setUseImage(false);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-6xl">🥠</div>
                </motion.div>
              )}

              {/* Soft lighting overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 35% 35%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                  mixBlendMode: 'soft-light'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper slip reveal */}
        <AnimatePresence>
          {showPaper && <PaperSlip />}
        </AnimatePresence>

        {/* Sparkles when breaking */}
        {isBroken && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-3 h-3 bg-yellow-300 rounded-full" />
          </motion.div>
        )}
      </div>
      
      {!isOpening && !isBroken && (
        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ 
            opacity: [0.8, 1, 0.8], 
            y: 0,
            filter: 'blur(0px)'
          }}
          transition={{
            opacity: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            y: { duration: 0.6 },
            filter: { duration: 0.6 }
          }}
        >
          <motion.p
            className="text-xl text-center relative"
            style={{
              color: '#1a3d1a',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              letterSpacing: '0.5px',
              lineHeight: 1.6,
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(0, 0, 0, 0.3)'
            }}
          >
            {tapCount === 0 && 'Нажмите, чтобы узнать судьбу'}
            {tapCount === 1 && 'Ещё раз...'}
            {tapCount === 2 && 'Почти готово!'}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FortuneCookie;
