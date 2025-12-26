import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RefreshCw, Sparkles } from 'lucide-react';
import FortuneCookie from './FortuneCookie';
// import CookieBackground from './CookieBackground'; // Not used currently
import { predictionsList } from './predictions';

function App() {
  const [isOpening, setIsOpening] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState('');
  const AdControllerRef = useRef(null);

  // Check if Telegram WebApp is available
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp;

  // Debug: Log if app is rendering
  useEffect(() => {
    console.log('App component mounted');
    console.log('Telegram WebApp available:', isTelegramWebApp);
  }, [isTelegramWebApp]);

  useEffect(() => {
    if (isTelegramWebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Set theme colors if available
      if (tg.themeParams) {
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          tg.themeParams.bg_color || 'var(--tg-theme-bg-color)'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          tg.themeParams.text_color || 'var(--tg-theme-text-color)'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-button-color',
          tg.themeParams.button_color || 'var(--tg-theme-button-color)'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-button-text-color',
          tg.themeParams.button_text_color || 'var(--tg-theme-button-text-color)'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-secondary-bg-color',
          tg.themeParams.secondary_bg_color || 'var(--tg-theme-secondary-bg-color)'
        );
      }
    }

    // Initialize Adsgram
    // ВАЖНО: Замените 'YOUR_BLOCK_ID' на реальный ID из Adsgram (например: "12345" или "int-12345")
    // Если ID не указан, реклама не будет показываться
    const adsgramBlockId = "YOUR_BLOCK_ID"; // Замените на реальный ID
    
    if (typeof window !== 'undefined' && window.Adsgram && adsgramBlockId !== "YOUR_BLOCK_ID") {
      try {
        AdControllerRef.current = window.Adsgram.init({ blockId: adsgramBlockId });
      } catch (error) {
        console.log('Adsgram initialization error:', error);
      }
    }
  }, [isTelegramWebApp]);

  const getRandomPrediction = () => {
    const randomIndex = Math.floor(Math.random() * predictionsList.length);
    return predictionsList[randomIndex];
  };

  const handleCookieClick = () => {
    if (isOpening || showPrediction) return;

    setIsOpening(true);
    // Убираем загрузку, сразу показываем предсказание
    const prediction = getRandomPrediction();
    setCurrentPrediction(prediction);
    setShowPrediction(true);
  };

  const handleShareToStory = () => {
    if (isTelegramWebApp && window.Telegram.WebApp.shareToStory) {
      try {
        window.Telegram.WebApp.shareToStory({
          text: `🥠 Мое предсказание дня: "${currentPrediction}"\n\nУзнай своё в приложении! 👇`,
          widget_link: {
            text: "Открыть печенье",
            name: "FortuneCookieBot",
            url: window.location.href
          }
        });
      } catch (error) {
        console.log('Share to story not available:', error);
        // Fallback: copy to clipboard
        navigator.clipboard?.writeText(`🥠 Мое предсказание: "${currentPrediction}"`);
        alert('Предсказание скопировано в буфер обмена!');
      }
    } else {
      // Fallback for browser testing
      navigator.clipboard?.writeText(`🥠 Мое предсказание: "${currentPrediction}"`);
      alert('Предсказание скопировано в буфер обмена!');
    }
  };

  const handleOpenAnother = () => {
    setIsOpening(false);
    setShowPrediction(false);
    setCurrentPrediction('');
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #a8e6cf)',
        color: 'var(--tg-theme-text-color, #000000)',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <div className="relative z-10 w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!showPrediction ? (
          <motion.div
            key="cookie"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            <FortuneCookie onOpen={handleCookieClick} isOpening={isOpening} adController={AdControllerRef.current} />
          </motion.div>
        ) : (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center max-w-md w-full"
          >
            <motion.div
              className="prediction-card w-full p-6 rounded-sm shadow-lg mb-6 relative overflow-hidden"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Decorative corner ornaments */}
              <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <path
                    d="M 8 8 L 8 20 L 20 8 Z M 8 8 L 20 8 L 8 20"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="12" cy="12" r="1.5" fill="#8b5cf6" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <path
                    d="M 56 8 L 44 8 L 56 20 Z M 56 8 L 44 8 L 56 20"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="52" cy="12" r="1.5" fill="#8b5cf6" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <path
                    d="M 8 56 L 8 44 L 20 56 Z M 8 56 L 20 56 L 8 44"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="12" cy="52" r="1.5" fill="#8b5cf6" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <path
                    d="M 56 56 L 44 56 L 56 44 Z M 56 56 L 44 56 L 56 44"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="52" cy="52" r="1.5" fill="#8b5cf6" />
                </svg>
              </div>

              {/* Decorative border lines */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.3), transparent)',
                  top: '12px'
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.3), transparent)',
                  bottom: '12px'
                }}
              />
              <div
                className="absolute top-0 left-0 bottom-0"
                style={{
                  width: '2px',
                  background: 'linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.2), rgba(251, 191, 36, 0.15), rgba(139, 92, 246, 0.2), transparent)',
                  left: '12px'
                }}
              />
              <div
                className="absolute top-0 right-0 bottom-0"
                style={{
                  width: '2px',
                  background: 'linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.2), rgba(251, 191, 36, 0.15), rgba(139, 92, 246, 0.2), transparent)',
                  right: '12px'
                }}
              />

              {/* Subtle watercolor effect at edges */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                    radial-gradient(ellipse at top right, rgba(251, 191, 36, 0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at bottom left, rgba(251, 191, 36, 0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
                  `
                }}
              />

              {/* Small decorative stars */}
              <div className="absolute top-6 left-1/4 w-2 h-2 opacity-30">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
                    fill="#8b5cf6"
                  />
                </svg>
              </div>
              <div className="absolute top-8 right-1/4 w-1.5 h-1.5 opacity-25">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
                    fill="#f59e0b"
                  />
                </svg>
              </div>
              <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 opacity-25">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
                    fill="#8b5cf6"
                  />
                </svg>
              </div>
              <div className="absolute bottom-8 right-1/3 w-2 h-2 opacity-30">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
                    fill="#f59e0b"
                  />
                </svg>
              </div>

              {/* Small decorative cookies - positioned to avoid text area */}
              {/* Top area cookies */}
              <motion.div
                className="absolute top-8 left-8 w-6 h-6 opacity-15 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie1)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                  <circle cx="16" cy="18" r="1" fill="#92400e" opacity="0.4" />
                  <circle cx="24" cy="22" r="1" fill="#92400e" opacity="0.4" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-12 right-12 w-5 h-5 opacity-12 pointer-events-none"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 0.12, scale: 1, rotate: 15 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie2)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              {/* Left side cookies */}
              <motion.div
                className="absolute top-1/3 left-4 w-5 h-5 opacity-12 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.12, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie3)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 left-6 w-6 h-6 opacity-15 pointer-events-none"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 0.15, scale: 1, rotate: -20 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie4)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                  <circle cx="18" cy="20" r="0.8" fill="#92400e" opacity="0.4" />
                </svg>
              </motion.div>

              {/* Right side cookies */}
              <motion.div
                className="absolute top-1/4 right-4 w-5 h-5 opacity-12 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.12, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie5)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 right-6 w-6 h-6 opacity-15 pointer-events-none"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 0.15, scale: 1, rotate: 25 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie6" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie6)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                  <circle cx="16" cy="18" r="0.8" fill="#92400e" opacity="0.4" />
                  <circle cx="24" cy="22" r="0.8" fill="#92400e" opacity="0.4" />
                </svg>
              </motion.div>

              {/* Bottom area cookies */}
              <motion.div
                className="absolute bottom-10 left-12 w-5 h-5 opacity-12 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.12, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie7" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie7)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-8 right-10 w-6 h-6 opacity-15 pointer-events-none"
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 0.15, scale: 1, rotate: -15 }}
                transition={{ delay: 1.3, duration: 0.4 }}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="smallCookie8" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                      <stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 8 20 Q 12 8, 20 10 Q 28 8, 32 20 Q 28 32, 20 30 Q 12 32, 8 20 Z"
                    fill="url(#smallCookie8)"
                    stroke="#92400e"
                    strokeWidth="0.5"
                  />
                  <circle cx="20" cy="20" r="0.8" fill="#92400e" opacity="0.4" />
                </svg>
              </motion.div>

              {/* Paper fold lines (subtle) */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)',
                  top: '24px'
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)',
                  bottom: '24px'
                }}
              />
              
              <div className="relative z-10">
                <motion.h2
                  className="text-2xl font-bold mb-6 text-center"
                  style={{
                    color: '#2d1b4e',
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.5px'
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Ваше предсказание
                </motion.h2>
                <div className="relative">
                  {/* Golden sparkles icon */}
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotate: 360
                    }}
                    transition={{ 
                      delay: 0.6,
                      duration: 2,
                      rotate: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  >
                    <Sparkles 
                      size={24} 
                      className="text-yellow-400"
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5))'
                      }}
                    />
                  </motion.div>
                  
                  <motion.p
                    className="prediction-text-content text-center relative"
                    initial={{ 
                      opacity: 0, 
                      y: 20,
                      filter: 'blur(10px)'
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      filter: 'blur(0px)'
                    }}
                    transition={{ 
                      delay: 0.7,
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                  >
                    <span className="prediction-quote prediction-quote-left">«</span>
                    {currentPrediction}
                    <span className="prediction-quote prediction-quote-right">»</span>
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 w-full">
              <motion.button
                onClick={handleShareToStory}
                className="w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-md"
                style={{
                  backgroundColor: 'var(--tg-theme-button-color)',
                  color: 'var(--tg-theme-button-text-color)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Share2 size={20} />
                Поделиться в историю
              </motion.button>

              <motion.button
                onClick={handleOpenAnother}
                className="secondary-button w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 border-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <RefreshCw size={20} />
                Открыть ещё одно
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

