import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const FortuneCookie = ({ onOpen, isOpening }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const [showPaper, setShowPaper] = useState(false);
  const [useImage, setUseImage] = useState(false); // Start with false, will check if image exists
  const imgRef = useRef(null);

  // Check if Telegram WebApp is available
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp;

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

    // On 3rd tap, break the cookie
    if (newTapCount >= 3) {
      setIsBroken(true);
      // Show paper after a short delay
      setTimeout(() => {
        setShowPaper(true);
        setTimeout(() => {
          onOpen();
        }, 800);
      }, 300);
    }
  };

  // Cookie half component
  const CookieHalf = ({ side, isBroken: broken }) => {
    const isLeft = side === 'left';
    const gradientId = isLeft ? 'fortuneGradientLeft' : 'fortuneGradientRight';
    const clipPathId = isLeft ? 'leftHalf' : 'rightHalf';
    
    const pathData = "M 40 100 Q 60 40, 100 50 Q 140 40, 160 100 Q 140 160, 100 150 Q 60 160, 40 100 Z";
    const clipPathData = isLeft 
      ? "M 40 100 Q 60 40, 100 50 Q 140 40, 100 100 Q 60 160, 40 100 Z"
      : "M 100 100 Q 140 40, 160 100 Q 140 160, 100 150 Q 60 160, 100 100 Z";
    const foldPath = isLeft
      ? "M 50 95 Q 70 50, 100 60"
      : "M 100 60 Q 130 50, 150 95";

    return (
      <motion.div
        className="absolute"
        style={{
          left: isLeft ? '0' : '100px',
          width: '100px',
          height: '200px',
          transformOrigin: isLeft ? 'right center' : 'left center',
          overflow: 'hidden'
        }}
        initial={broken ? {} : { x: 0, y: 0, rotate: 0 }}
        animate={broken ? {
          x: isLeft ? -50 : 50,
          y: isLeft ? -20 : 20,
          rotate: isLeft ? -35 : 35,
          opacity: [1, 0.9, 0.6]
        } : {}}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ 
          position: 'absolute',
          left: isLeft ? '0' : '-100px',
          top: 0
        }}>
          <defs>
            {/* Smooth golden gradient like in the image */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              {isLeft ? (
                <>
                  <stop offset="0%" stopColor="#ffd89b" stopOpacity="1" />
                  <stop offset="30%" stopColor="#ffb347" stopOpacity="1" />
                  <stop offset="70%" stopColor="#ffa500" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="1" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#ffb347" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffa500" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="1" />
                </>
              )}
            </linearGradient>
            {/* Soft highlight for 3D effect */}
            <radialGradient id={`${gradientId}Highlight`} cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffd89b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            {/* Soft shadow gradient */}
            <radialGradient id={`${gradientId}Shadow`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(168, 110, 0, 0.2)" stopOpacity="1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <clipPath id={clipPathId}>
            <path d={clipPathData} />
          </clipPath>
          <g clipPath={`url(#${clipPathId})`}>
            {/* Main cookie body with smooth appearance */}
            <path
              d={pathData}
              fill={`url(#${gradientId})`}
              stroke="rgba(255, 140, 0, 0.3)"
              strokeWidth="1"
              style={{ filter: 'blur(0.5px)' }}
            />
            {/* 3D highlight */}
            <ellipse
              cx={isLeft ? "70" : "130"}
              cy="70"
              rx="35"
              ry="25"
              fill={`url(#${gradientId}Highlight)`}
            />
            {/* Subtle fold line */}
            <path
              d={foldPath}
              stroke="rgba(255, 200, 100, 0.4)"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            {/* Paper slip peeking out (only on right side when whole) */}
            {!isLeft && !broken && (
              <motion.rect
                x="145"
                y="95"
                width="12"
                height="20"
                rx="1"
                fill="#f5f5dc"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="0.5"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 0.9, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </g>
        </svg>
      </motion.div>
    );
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

        {/* Cookie image or SVG halves container */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={tapCount > 0 && !isBroken ? getShakeAnimation(tapCount) : {}}
        >
          {!isBroken ? (
            // Whole cookie - try to use image first, fallback to SVG
            <>
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
                // SVG fallback
                <>
                  <CookieHalf side="left" isBroken={false} />
                  <CookieHalf side="right" isBroken={false} />
                </>
              )}
            </>
          ) : (
            // Broken cookie - use SVG halves
            <>
              <CookieHalf side="left" isBroken={isBroken} />
              <CookieHalf side="right" isBroken={isBroken} />
            </>
          )}

          {/* Soft lighting overlay (only when whole) */}
          {!isBroken && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 35% 35%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
                mixBlendMode: 'soft-light'
              }}
            />
          )}
        </motion.div>

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
        <motion.p
          className="cookie-instruction-text mt-8 text-xl font-semibold relative"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(135deg, #4a7c2a 0%, #2d5016 30%, #ffa500 60%, #ff8c00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 215, 0, 0.4)',
            letterSpacing: '1px',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
          }}
        >
          {tapCount === 0 && 'Нажмите, чтобы узнать судьбу'}
          {tapCount === 1 && 'Ещё раз...'}
          {tapCount === 2 && 'Почти готово!'}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FortuneCookie;
