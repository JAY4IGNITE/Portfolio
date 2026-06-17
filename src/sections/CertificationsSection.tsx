import { useState, useRef, useEffect, useCallback } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import ClipRevealImage from '../components/ClipRevealImage';
import { motion } from 'framer-motion';

interface Certification {
  name: string;
  issuer: string;
  image: string;
  pdf: string;
}

const certifications: Certification[] = [
  {
    name: 'C Essentials 1',
    issuer: 'Cisco Networking Academy',
    image: '/assets/certificates/C_Essentials_1_certificate.png',
    pdf: '/assets/certificates/C_Essentials_1_certificate.pdf',
  },
  {
    name: 'Basic SQL',
    issuer: 'HackerRank',
    image: '/assets/certificates/sql_basic_certificate.png',
    pdf: '/assets/certificates/sql_basic_certificate.pdf',
  },
  {
    name: 'RHA Basic',
    issuer: 'Red Hat Academy',
    image: '/assets/certificates/RHA_Basic.png',
    pdf: '/assets/certificates/RHA_Basic.pdf',
  },
  {
    name: 'CSS',
    issuer: 'HackerRank',
    image: '/assets/certificates/css_certificate.png',
    pdf: '/assets/certificates/css_certificate.pdf',
  },
  {
    name: 'Building With Claude API',
    issuer: 'Anthropic',
    image: '/assets/certificates/Building_With_Claude_Api.png',
    pdf: '/assets/certificates/Building_With_Claude_Api.pdf',
  },
  {
    name: 'Claude Code in Action',
    issuer: 'Anthropic',
    image: '/assets/certificates/Claude_Code_In_Action.png',
    pdf: '/assets/certificates/Claude_Code_In_Action.pdf',
  },
  {
    name: 'Introduction to Agent Skills',
    issuer: 'Anthropic',
    image: '/assets/certificates/Introduction_To_Agent_Skills.png',
    pdf: '/assets/certificates/Introduction_To_Agent_Skills.pdf',
  },
  {
    name: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic',
    image: '/assets/certificates/Introduction_To_Model_Context_Protocol.png',
    pdf: '/assets/certificates/Introduction_To_Model_Context_Protocol.pdf',
  },
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
      <section className="bg-white section-panel px-0 py-20 sm:py-24 md:py-32">
        <ScrollRevealText
          text="Certifications"
          as="h2"
          splitBy="chars"
          className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 px-5 sm:px-8 md:px-10 text-[clamp(3rem,8vw,110px)] leading-none"
          delay={0.03}
        />

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
                  className="group cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B600A8]/50 rounded-3xl relative"
                  style={{
                    width: `${CARD_WIDTH}px`,
                    height: '350px',
                    scrollSnapAlign: 'start',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{ rotateY: isFlipped ? 180 : 0, y: isFlipped ? -10 : 0 }}
                  whileHover={{ y: isFlipped ? -10 : -6, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* FRONT FACE */}
                  <div 
                    className="absolute inset-0 bg-[#f8f9fa] rounded-3xl overflow-hidden border border-[#0C0C0C]/5 group-hover:border-[#B600A8]/30 transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-[#B600A8]/8 flex flex-col pointer-events-none"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {cert.image ? (
                        <ClipRevealImage
                          src={`${import.meta.env.BASE_URL}${cert.image.slice(1)}`}
                          alt={cert.name}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-500 pointer-events-auto"
                          direction="bottom"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F9F6F0] to-[#EADEC9] flex flex-col justify-center items-center p-6 text-center select-none relative group-hover:scale-105 transition-transform duration-500 pointer-events-auto">
                          <div className="absolute inset-0 bg-[#0C0C0C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-3">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[#D97706] stroke-[1.5] fill-none">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-[#D97706] font-bold text-[10px] uppercase tracking-widest leading-none">
                            Anthropic Certified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 pointer-events-auto">
                      <h3 className="text-[#0C0C0C] font-semibold text-sm sm:text-base leading-snug line-clamp-2 min-h-[40px]">
                        {cert.name}
                      </h3>
                      <p className="text-[#0C0C0C]/50 text-xs font-light mt-1 uppercase tracking-wider">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div 
                    className="absolute inset-0 bg-[#111111] rounded-3xl overflow-hidden border border-[#B600A8]/30 shadow-xl flex flex-col items-center justify-center group/back"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {cert.image ? (
                      <img 
                        src={`${import.meta.env.BASE_URL}${cert.image.slice(1)}`} 
                        alt={cert.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover/back:opacity-20 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-[#0C0C0C]" />
                    )}
                    
                    <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full h-full bg-gradient-to-t from-[#111111]/90 via-[#111111]/50 to-transparent">
                      <h3 className="text-white font-bold text-lg mb-2 drop-shadow-md">{cert.name}</h3>
                      <p className="text-white/80 text-xs mb-6 drop-shadow-md uppercase tracking-widest">{cert.issuer}</p>
                      
                      <a
                        href={`${import.meta.env.BASE_URL}${cert.pdf.slice(1)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-[#B600A8] hover:border-[#B600A8] transition-colors shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View PDF
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
      </section>


    </>
  );
};

export default CertificationsSection;

