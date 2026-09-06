import { useState, useRef, useEffect, useCallback } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import ClipRevealImage from '../components/ClipRevealImage';
import { motion } from 'framer-motion';

export interface Certification {
  name: string;
  issuer: string;
  image: string;
  pdf: string;
}

const certifications: Certification[] = [
  // Add your certificates here. Example format:
  // {
  //   name: 'Certificate Name',
  //   issuer: 'Issuing Organization',
  //   image: '/assets/certificates/your_certificate.png',
  //   pdf: '/assets/certificates/your_certificate.pdf',
  // },
];

const CARD_WIDTH = 320;
const CARD_GAP = 24;

const CertificationsSection = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Key handler for un-flipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFlippedIndex(null);
    };
    if (flippedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flippedIndex]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Update active dot based on scroll position
    const cardTotal = CARD_WIDTH + CARD_GAP;
    const idx = Math.round(el.scrollLeft / cardTotal);
    setActiveIndex(Math.min(idx, certifications.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = false;
    setIsGrabbing(true);
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    el.style.scrollBehavior = 'auto'; // disable smooth during drag
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isGrabbing) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5; // multiply for faster drag feel
    if (Math.abs(walk) > 5) isDragging.current = true;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
    const el = scrollRef.current;
    if (el) el.style.scrollBehavior = 'smooth';
  };

  const handleMouseLeave = () => {
    if (isGrabbing) {
      setIsGrabbing(false);
      const el = scrollRef.current;
      if (el) el.style.scrollBehavior = 'smooth';
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = CARD_WIDTH + CARD_GAP;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: index * (CARD_WIDTH + CARD_GAP),
      behavior: 'smooth',
    });
  };

  const handleCardClick = (index: number) => {
    // Don't flip if user was dragging
    if (isDragging.current) return;
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <>
      <section id="certifications" className="bg-white section-panel px-0 py-20 sm:py-24 md:py-32">
        <ScrollRevealText
          text="Certifications"
          as="h2"
          splitBy="chars"
          className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 px-5 sm:px-8 md:px-10 text-[clamp(3rem,8vw,110px)] leading-none"
          delay={0.03}
        />

        {certifications.length > 0 ? (
          <div className="relative">
            {/* Left gradient fade */}
            <div
              className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to right, white, transparent)',
                opacity: canScrollLeft ? 1 : 0,
              }}
            />
            {/* Right gradient fade */}
            <div
              className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to left, white, transparent)',
                opacity: canScrollRight ? 1 : 0,
              }}
            />

            {/* Left arrow */}
            <button
              onClick={() => scrollTo('left')}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-[#0C0C0C]/10 flex items-center justify-center shadow-lg hover:bg-[#B600A8] hover:border-[#B600A8] hover:text-white text-[#0C0C0C] transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              onClick={() => scrollTo('right')}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-[#0C0C0C]/10 flex items-center justify-center shadow-lg hover:bg-[#B600A8] hover:border-[#B600A8] hover:text-white text-[#0C0C0C] transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="flex gap-6 overflow-x-auto scroll-smooth px-8 sm:px-16 md:px-24 pb-4 hide-scrollbar grab-scroll"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: isGrabbing ? 'none' : 'x mandatory',
              }}
            >
              {certifications.map((cert, i) => {
                const isFlipped = flippedIndex === i;
                
                return (
                <FadeIn key={cert.name} delay={i * 0.08} y={30} className="flex-shrink-0 perspective-[1200px]">
                  <motion.div
                    onClick={() => handleCardClick(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(i);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cert.name} certificate. Click to ${isFlipped ? 'view certificate image' : 'view certificate details'}`}
                    data-cursor="view"
                    className="relative cursor-pointer select-none"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      height: '420px',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* FRONT OF CARD (Certificate Preview) */}
                    <div
                      className="absolute inset-0 rounded-[30px] overflow-hidden border border-[#0C0C0C]/10 bg-[#F5F5F5] shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {/* Image container */}
                      <div className="relative flex-1 overflow-hidden bg-black/5">
                        <ClipRevealImage
                          src={cert.image.startsWith('/') ? `${import.meta.env.BASE_URL}${cert.image.slice(1)}` : cert.image}
                          alt={`${cert.name} certificate`}
                          className="w-full h-full object-cover"
                          direction="bottom"
                        />
                        {/* Hover hint badge */}
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium bg-[#0C0C0C]/70 text-white backdrop-blur-sm">
                          Flip ↻
                        </span>
                      </div>

                      {/* Card footer */}
                      <div className="p-5 bg-white border-t border-[#0C0C0C]/5">
                        <span className="text-[#B600A8] text-xs uppercase tracking-widest font-medium block mb-1">
                          {cert.issuer}
                        </span>
                        <h3 className="text-[#0C0C0C] font-semibold text-base leading-snug line-clamp-2">
                          {cert.name}
                        </h3>
                      </div>
                    </div>

                    {/* BACK OF CARD (Details + Actions) */}
                    <div
                      className="absolute inset-0 rounded-[30px] overflow-hidden border border-[#0C0C0C]/10 bg-[#0C0C0C] text-[#D7E2EA] p-6 flex flex-col justify-between shadow-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div>
                        <span className="text-[#B600A8] text-xs uppercase tracking-widest font-medium block mb-2">
                          {cert.issuer}
                        </span>
                        <h3 className="text-white font-bold text-xl leading-tight mb-4">
                          {cert.name}
                        </h3>
                        <div className="w-10 h-[2px] bg-[#B600A8] mb-4" />
                        <p className="text-[#D7E2EA]/60 text-xs leading-relaxed">
                          Verified certification issued by {cert.issuer}. Click below to view the official credential.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href={cert.pdf.startsWith('/') ? `${import.meta.env.BASE_URL}${cert.pdf.slice(1)}` : cert.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-3 px-4 rounded-full bg-[#B600A8] hover:bg-[#9a008e] text-white text-center text-xs uppercase tracking-widest font-medium transition-colors duration-200"
                        >
                          View Credential ↗
                        </a>
                        <button
                          className="mt-6 text-white/40 hover:text-white/80 text-[10px] uppercase tracking-[0.2em] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedIndex(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {certifications.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: activeIndex === i ? '28px' : '8px',
                    height: '8px',
                    backgroundColor: activeIndex === i ? '#B600A8' : '#0C0C0C1A',
                  }}
                  aria-label={`Go to certificate ${i + 1}`}
                />
              ))}
            </div>

            {/* Scroll hint — visible only on first load */}
            <p className="text-center text-[#0C0C0C]/30 text-xs mt-4 uppercase tracking-widest font-light">
              ← Drag or scroll to explore →
            </p>
          </div>
        ) : (
          <div className="text-center py-20 px-6 border border-dashed border-[#0C0C0C]/15 rounded-[30px] max-w-4xl mx-auto">
            <p className="text-[#0C0C0C]/40 text-base sm:text-lg uppercase tracking-widest font-light">
              No certificates added yet
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default CertificationsSection;

