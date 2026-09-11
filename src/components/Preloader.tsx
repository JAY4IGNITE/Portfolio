import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader({ onComplete, onStartZoomOut }: { onComplete: () => void, onStartZoomOut: () => void }) {
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [showText, setShowText] = useState(false);
  const textChars = "RISHNA".split("");

  useEffect(() => {
    // Reveal 'RISHNA' smoothly
    const t1 = setTimeout(() => setShowText(true), 500);
    
    // Compress back to 'K'
    const t2 = setTimeout(() => setShowText(false), 2000);
    
    // Trigger zoom-out for the remaining 'K'
    const t3 = setTimeout(() => {
      setIsZoomingOut(true);
      onStartZoomOut();
      // Wait for the exit animation to finish before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, onStartZoomOut]);

  return (
    <AnimatePresence>
      {!isZoomingOut && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Background layer */}
          <motion.div 
            className="absolute inset-0 bg-[#0C0C0C] pointer-events-auto" 
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }} 
          />

          {/* Logo container that zooms out extremely when exiting */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            exit={{
              scale: 8, // Clean zoom out
              opacity: 0,
              filter: 'blur(20px)',
              transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] }
            }}
            className="flex items-center text-6xl sm:text-8xl md:text-[10rem] font-bold tracking-tight select-none"
          >
            <motion.span className="text-[#1E3A8A] z-10 relative">K</motion.span>
            
            <motion.div
              initial="hidden"
              animate={showText ? "visible" : "hidden"}
              variants={{
                hidden: { width: 0 },
                visible: {
                  width: "auto",
                  transition: { 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                    when: "beforeChildren",
                    staggerChildren: 0.08
                  }
                }
              }}
              className="overflow-hidden whitespace-nowrap text-white flex items-center"
            >
              <div className="flex -ml-1 sm:-ml-2">
                {textChars.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, filter: "blur(4px)" },
                      visible: { 
                        opacity: 1, 
                        filter: "blur(0px)",
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
