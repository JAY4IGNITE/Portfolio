import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  X, 
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
  cardWidth = 430,
  cardHeight = 540,
  showControls = false,
  showIndicators = false,
  autoScroll = true,
  autoScrollInterval = 3800,
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
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Modal navigation
  const handleModalNext = useCallback(() => {
    if (!selectedItem || items.length <= 1) return;
    const currentIndex = items.findIndex((it) => it.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedItem(items[nextIndex]);
  }, [items, selectedItem]);

  const handleModalPrev = useCallback(() => {
    if (!selectedItem || items.length <= 1) return;
    const currentIndex = items.findIndex((it) => it.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setSelectedItem(items[prevIndex]);
  }, [items, selectedItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === 'Escape') setSelectedItem(null);
        if (e.key === 'ArrowRight') handleModalNext();
        if (e.key === 'ArrowLeft') handleModalPrev();
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleModalNext, handleModalPrev, selectedItem]);

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

  const dynamicWidth = Math.min(cardWidth, windowWidth - 36);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden py-6 select-none"
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
            const rotateY = offset * -22;
            const translateX = offset * (dynamicWidth * 0.74);
            const translateZ = -Math.abs(offset) * 150;
            const scale = 1 - Math.abs(offset) * 0.1;
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
                  className={`relative w-full h-full rounded-[28px] overflow-hidden border transition-all duration-500 flex flex-col ${
                    isActive
                      ? 'border-white/25 bg-[#121216]/95 backdrop-blur-2xl ring-1 ring-white/20'
                      : 'border-white/10 bg-[#0e0e12]/85 backdrop-blur-xl hover:border-white/20 shadow-xl'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 24px 60px -15px ${item.gradient.ambient}, 0 0 35px -10px ${item.gradient.primary}35`
                      : undefined,
                  }}
                >
                  {/* Subtle top rim highlight */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />

                  {/* ─── CERTIFICATE IMAGE FRAME ─── */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="relative w-full h-[58%] overflow-hidden bg-gradient-to-b from-[#171821] to-[#0c0d11] border-b border-white/[0.08] flex items-center justify-center p-3 sm:p-4 group/img cursor-pointer"
                  >
                    {/* Ambient Glow behind document */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-25 blur-xl"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${item.gradient.primary}, transparent 75%)`,
                      }}
                    />

                    {/* Framed Certificate Document */}
                    <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.7)] ring-1 ring-white/20 transition-transform duration-500 group-hover/img:scale-[1.02]">
                      <img
                        src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, '')}`}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        loading="eager"
                        decoding="async"
                      />

                      {/* Hover Overlay with Quick Preview pill */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/25 text-white text-xs font-mono font-medium shadow-2xl tracking-wide">
                          <Maximize2 className="w-3.5 h-3.5 text-[#B600A8]" />
                          View Certificate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── CARD CONTENT FOOTER ─── */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#131318]/95 to-[#0b0b0e]">
                    <div>
                      {/* Date & Issuer */}
                      <div className="flex items-center justify-between text-xs text-[#D7E2EA]/60 font-mono mb-2">
                        <span className="flex items-center gap-1.5 text-[#D7E2EA]/65">
                          <Calendar className="w-3.5 h-3.5 text-[#D7E2EA]/40" />
                          {item.date}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-[#D7E2EA]/75 uppercase tracking-wider">
                          {item.issuer}
                        </span>
                      </div>

                      {/* Course / Certification Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#D7E2EA] transition-all line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      {/* Recipient note */}
                      <p className="text-[11.5px] font-mono text-[#D7E2EA]/40 mt-1 truncate">
                        Recipient: <span className="text-[#D7E2EA]/75">{item.recipient}</span>
                      </p>
                    </div>

                    {/* Tags & Action Buttons */}
                    <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 overflow-hidden">
                        {item.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono text-[#D7E2EA]/70 bg-white/[0.04] border border-white/[0.08] truncate max-w-[130px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Clean Actions: Expand + Download PDF (No Verify Online redirect button) */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#D7E2EA] hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 cursor-pointer shadow-sm active:scale-95"
                          title="View Certificate"
                          aria-label="View Certificate"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>

                        <a
                          href={`${import.meta.env.BASE_URL}${item.pdf.replace(/^\//, '')}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B600A8] to-[#7621B0] hover:brightness-110 text-white text-xs font-mono font-medium transition-all duration-200 border border-white/15 shadow-[0_2px_12px_rgba(182,0,168,0.3)] cursor-pointer active:scale-95"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
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
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-3">
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.15] text-white flex items-center justify-center backdrop-blur-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/30"
              aria-label="Previous Certificate"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Counter Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#D7E2EA]/70 backdrop-blur-md flex items-center gap-1.5">
              <span className="text-white font-bold">{String(safeActiveIndex + 1).padStart(2, '0')}</span>
              <span className="text-[#D7E2EA]/30">/</span>
              <span>{String(items.length).padStart(2, '0')}</span>
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.15] text-white flex items-center justify-center backdrop-blur-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:border-white/30"
              aria-label="Next Certificate"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          {showIndicators && items.length <= 25 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md overflow-x-auto max-w-[90vw] scrollbar-none">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeActiveIndex
                      ? 'w-6 bg-gradient-to-r from-[#B600A8] to-[#7621B0] shadow-[0_0_8px_rgba(182,0,168,0.7)]'
                      : 'w-2 bg-white/20 hover:bg-white/45'
                  }`}
                  aria-label={`Jump to certificate ${i + 1}`}
                />
              ))}
            </div>
          )}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/20 bg-[#111116] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.04] to-transparent">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-semibold tracking-wider text-purple-400 uppercase">
                      {selectedItem.issuer}
                    </span>
                    {selectedItem.category && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-[#D7E2EA]/70">
                        {selectedItem.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                    {selectedItem.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95 flex-shrink-0"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Display with In-Modal Navigation */}
              <div className="relative flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-black/60 min-h-[300px]">
                {items.length > 1 && (
                  <button
                    onClick={handleModalPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg"
                    aria-label="Previous Certificate"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                <img
                  src={`${import.meta.env.BASE_URL}${selectedItem.image.replace(/^\//, '')}`}
                  alt={selectedItem.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/15"
                />

                {items.length > 1 && (
                  <button
                    onClick={handleModalNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg"
                    aria-label="Next Certificate"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Modal Footer Actions (No Verify Online redirect button) */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-transparent to-white/[0.02]">
                <div className="text-xs sm:text-sm text-[#D7E2EA]/70 font-mono flex items-center gap-2">
                  <span>Issued to <strong className="text-white">{selectedItem.recipient}</strong></span>
                  <span className="text-white/20">•</span>
                  <span>{selectedItem.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`${import.meta.env.BASE_URL}${selectedItem.pdf.replace(/^\//, '')}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] hover:brightness-110 text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(182,0,168,0.4)] cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download Certificate PDF
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
