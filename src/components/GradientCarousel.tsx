import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Maximize2, 
  X, 
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export interface GradientCarouselItem {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  date: string;
  category?: string;
  image: string;
  pdf: string;
  verifyUrl?: string;
  tags: string[];
  gradient: {
    primary: string;
    secondary: string;
    ambient: string;
    accentGlow: string;
  };
}

interface GradientCarouselProps {
  items: GradientCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  pauseOnHover?: boolean;
}

export const GradientCarousel = ({
  items,
  cardWidth = 420,
  cardHeight = 520,
  showControls = true,
  showIndicators = true,
  autoScroll = true,
  autoScrollInterval = 3200,
  pauseOnHover = true,
}: GradientCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<GradientCarouselItem | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safe active item fallback
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  const activeItem = items[safeActiveIndex] || items[0];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === 'Escape') setSelectedItem(null);
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedItem]);

  // Auto-scroll timer
  useEffect(() => {
    if (!autoScroll || items.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    if (selectedItem !== null) return; // Pause while modal is active
    if (dragStartX !== null) return; // Pause during drag

    const timer = setInterval(() => {
      handleNext();
    }, autoScrollInterval);

    return () => clearInterval(timer);
  }, [autoScroll, autoScrollInterval, pauseOnHover, isHovered, selectedItem, dragStartX, items.length, handleNext]);

  // Touch & Mouse Drag
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setDragStartX(null);
  };

  if (!items || items.length === 0) return null;

  const dynamicWidth = Math.min(cardWidth, windowWidth - 48);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden py-8 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* ─── DYNAMIC GRADIENT BACKGROUND EXTRACTION ─── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Primary Ambient Spotlight */}
        <motion.div
          key={`primary-${activeItem?.id || 'default'}`}
          initial={{ opacity: 0 }}
          animate={{
            background: `radial-gradient(circle, ${activeItem.gradient.primary} 0%, ${activeItem.gradient.secondary} 40%, transparent 70%)`,
            opacity: 0.28,
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="w-[700px] sm:w-[950px] h-[550px] sm:h-[650px] rounded-full blur-[140px] will-change-transform"
        />

        {/* Secondary Color Flare */}
        <motion.div
          key={`secondary-${activeItem?.id || 'default'}`}
          initial={{ opacity: 0 }}
          animate={{
            background: `radial-gradient(ellipse at center, ${activeItem.gradient.secondary} 0%, transparent 65%)`,
            opacity: 0.22,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute -top-12 w-[600px] h-[400px] rounded-full blur-[120px]"
        />
      </div>

      {/* ─── 3D CAROUSEL STAGE ─── */}
      <div 
        className="relative z-10 w-full flex items-center justify-center mx-auto"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          height: `${cardHeight + 40}px`,
        }}
      >
        <div 
          className="relative w-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            // Distance from active card
            let offset = index - safeActiveIndex;
            // Wrap around for smooth cyclical feel
            const halfLen = items.length / 2;
            if (offset > halfLen) offset -= items.length;
            if (offset < -halfLen) offset += items.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // 3D Transforms based on distance
            const rotateY = offset * -24;
            const translateX = offset * (dynamicWidth * 0.72);
            const translateZ = -Math.abs(offset) * 160;
            const scale = 1 - Math.abs(offset) * 0.12;
            const opacity = isActive ? 1 : Math.max(0.4, 0.85 - Math.abs(offset) * 0.3);
            const zIndex = 20 - Math.abs(offset);

            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                  }
                }}
                animate={{
                  rotateY,
                  x: translateX,
                  z: translateZ,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                  width: `${dynamicWidth}px`,
                  height: `${cardHeight}px`,
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  cursor: isActive ? 'default' : 'pointer',
                }}
                className="group"
              >
                {/* Card Outer Shell */}
                <div
                  className={`relative w-full h-full rounded-[32px] overflow-hidden border bg-[#111114]/90 backdrop-blur-xl transition-all duration-500 flex flex-col ${
                    isActive
                      ? 'border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/20'
                      : 'border-white/10 hover:border-white/20 shadow-xl'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 20px 50px -10px ${item.gradient.ambient}` : undefined,
                  }}
                >
                  {/* Certificate Image Frame */}
                  <div className="relative w-full h-[58%] overflow-hidden bg-black/60 border-b border-white/[0.08] flex items-center justify-center p-3">
                    <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-white/95 shadow-inner">
                      <img
                        src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                        alt={item.title}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    {/* Gradient Overlay Accent */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-10"
                      style={{
                        background: `linear-gradient(135deg, ${item.gradient.primary}, transparent)`,
                      }}
                    />

                    {/* View Fullscreen Button on Card Image */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
                      title="View Full Certificate"
                    >
                      <Maximize2 className="w-4 h-4 text-white/90" />
                    </button>

                    {/* Issuer Pill */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-md">
                      <Award className="w-3.5 h-3.5" style={{ color: item.gradient.primary }} />
                      <span className="text-[11px] font-mono font-medium tracking-wide text-white/90 uppercase">
                        {item.issuer}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#111114]/95 to-[#0C0C0E]">
                    <div>
                      {/* Date & Verification status */}
                      <div className="flex items-center justify-between text-xs text-[#D7E2EA]/50 font-mono mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D7E2EA]/40" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Verified
                        </span>
                      </div>

                      {/* Course / Certification Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#D7E2EA] transition-all line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Tags & Action Buttons */}
                    <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 max-w-[62%] overflow-hidden">
                        {item.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#D7E2EA]/70 bg-white/[0.04] border border-white/[0.06] truncate"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-1.5">
                        {item.verifyUrl && (
                          <a
                            href={item.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#D7E2EA] hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 cursor-pointer"
                            title="Verify Online"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <a
                          href={`${import.meta.env.BASE_URL}${item.pdf.replace(/^\//, '')}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#D7E2EA] hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 cursor-pointer"
                          title="Download Certificate PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── CONTROLS & NAVIGATION ─── */}
      {showControls && (
        <div className="relative z-20 flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white flex items-center justify-center backdrop-blur-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/30"
            aria-label="Previous Certificate"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Indicator Pills */}
          {showIndicators && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-[280px] sm:max-w-none overflow-x-auto hide-scrollbar">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeActiveIndex
                      ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Jump to certificate ${i + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.15] text-white flex items-center justify-center backdrop-blur-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/30"
            aria-label="Next Certificate"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* ─── FULLSCREEN CERTIFICATE MODAL ─── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#111114] shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <span className="text-xs font-mono font-medium tracking-wider text-purple-400 uppercase">
                    {selectedItem.issuer}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                    {selectedItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Display */}
              <div className="relative flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-black/50">
                <img
                  src={`${import.meta.env.BASE_URL}${selectedItem.image.replace(/^\//, '')}`}
                  alt={selectedItem.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
                <div className="text-xs sm:text-sm text-[#D7E2EA]/60 font-mono">
                  Issued to <span className="text-white font-semibold">{selectedItem.recipient}</span> • {selectedItem.date}
                </div>

                <div className="flex items-center gap-3">
                  {selectedItem.verifyUrl && (
                    <a
                      href={selectedItem.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/15 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify Online
                    </a>
                  )}

                  <a
                    href={`${import.meta.env.BASE_URL}${selectedItem.pdf.replace(/^\//, '')}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] hover:opacity-95 text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradientCarousel;
