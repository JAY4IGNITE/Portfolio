/**
 * HeroSection — Lando Norris-inspired Multi-Layer Parallax
 * ─────────────────────────────────────────────────────────────────────────────
 * Overhaul highlights:
 *  1. Extended 400vh scroll runway for more dramatic parallax travel
 *  2. 5 depth layers: bg-text → particles → floating orbs → portrait → heading
 *  3. Heading splits horizontally: "HI, I'M" goes left, "KRISHNA" goes right
 *  4. Scroll-driven vignette overlay that focuses attention on portrait center
 *  5. Each layer moves at a different scroll speed for convincing depth
 *  6. Parallax perspective container for true 3D depth rendering
 *  7. Signature scrub reveal remains outside the scaling wrapper
 */

import { useState, useRef, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import SlicedParallaxPortrait from '../components/SlicedParallaxPortrait';
import ParticleField from '../components/ParticleField';
import FloatingParallaxElements from '../components/FloatingParallaxElements';
import ParallaxBackgroundText from '../components/ParallaxBackgroundText';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import useActiveSection from '../hooks/useActiveSection';

const personalEmail = import.meta.env.VITE_PERSONAL_EMAIL || 'jayasaikrishnavasamsetti@gmail.com';
const personalPhone = import.meta.env.VITE_PERSONAL_PHONE || '+91 9030649777';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Journey', href: '#education' },
  { label: 'Tech Stack', href: '#tech-stack' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const activeSection = useActiveSection();
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll progress over the 400vh sticky section ─────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring for the scale value
  const rawScale = useTransform(scrollYProgress, [0, 0.4], [1, 1]);
  const contentScale = useSpring(rawScale, { stiffness: 100, damping: 30 });

  // ── Multi-layer parallax transforms ───────────────────────────────────
  // Heading split: "HI, I'M" goes left, "KRISHNA" goes right
  const headingSplitLeft = useTransform(scrollYProgress, [0, 0.35], [0, -120]);
  const headingSplitRight = useTransform(scrollYProgress, [0, 0.35], [0, 120]);

  // Heading vertical drift — rises faster than other elements
  const headingY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Tagline parallax — slightly slower than heading
  const taglineY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

  // Vignette — darkens from edges as you scroll, focusing on portrait center
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.4, 0.8]);

  // Signature scrub
  const signatureProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);
  const signatureClip = useTransform(
    signatureProgress,
    [0, 1],
    ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );

  // ✅ Correct API — replaces deprecated .onChange()
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsScrolling(latest > 0.02);
  });

  // Drawer key/scroll handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <section
      ref={sectionRef}
      className="h-[250vh] sm:h-[300vh] md:h-[400vh] w-full relative"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-clip relative bg-black parallax-perspective">

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 0 (deepest): Atmospheric background text
            Scrolls at ~0.15x — barely moves, pure atmosphere
            ═══════════════════════════════════════════════════════════════════ */}
        <ParallaxBackgroundText
          scrollYProgress={scrollYProgress}
          text="DEVELOPER"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 1: Three.js Particle Constellation
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <ParticleField text="KRISHNA" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 2: Floating parallax decorations (orbs + wireframes)
            Each element at a unique depth speed
            ═══════════════════════════════════════════════════════════════════ */}
        <FloatingParallaxElements scrollYProgress={scrollYProgress} />

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 3: Scroll-driven vignette overlay
            Darkens edges as you scroll to focus on portrait
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 z-[6] pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background: 'radial-gradient(ellipse 50% 50% at 50% 55%, transparent 0%, rgba(0,0,0,0.9) 100%)',
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            LAYER 4: Scalable foreground — heading, portrait, tagline
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ scale: contentScale }}
          className="relative z-10 w-full h-full flex flex-col px-6 md:px-10 bg-transparent origin-center overflow-visible shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        >
          {/* Navbar & Floating Pill */}
          <AnimatePresence mode="wait">
            {!isScrolling ? (
              <motion.div
                key="default-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full relative z-30"
              >
                <nav className="flex justify-between items-center w-full pt-6 md:pt-8 relative z-30">
                  <div />
                  <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2.5 text-[#D7E2EA] font-medium uppercase tracking-widest text-[11px] sm:text-xs hover:opacity-75 transition-opacity duration-200 cursor-pointer bg-[#D7E2EA]/5 px-5 py-2.5 rounded-full border border-[#D7E2EA]/10 hover:border-[#B600A8]/30"
                  >
                    <span>Menu</span>
                    <Menu className="w-4 h-4 text-[#B600A8]" />
                  </button>
                </nav>
              </motion.div>
            ) : (
              <motion.div
                key="floating-pill"
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="fixed top-6 right-6 z-40"
              >
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2.5 text-[#D7E2EA] font-medium uppercase tracking-widest text-[11px] sm:text-xs cursor-pointer bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-[#B600A8]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105"
                >
                  <span>Menu</span>
                  <Menu className="w-4 h-4 text-[#B600A8]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Drawer ─────────────────────────────────────────────────── */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Menu"
                className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-8 md:p-12"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 180 }}
              >
                <div className="flex justify-between items-center w-full">
                  <div />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-[11px] sm:text-xs hover:opacity-75 transition-opacity duration-200 cursor-pointer bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:border-[#7621B0]/30"
                  >
                    <span>Close</span>
                    <X className="w-4 h-4 text-[#7621B0]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-3 sm:gap-5 md:gap-6 my-auto pl-2 sm:pl-4 max-h-[60vh] overflow-y-auto py-4">
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none transition-colors duration-300 relative ${isActive
                            ? 'text-[#B600A8] pl-3 sm:pl-5'
                            : 'text-[#D7E2EA]/70 hover:text-[#D7E2EA]'
                          }`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active-indicator"
                            className="absolute left-0 top-1 bottom-1 w-[3px] sm:w-[4px] rounded-full bg-[#B600A8]"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            style={{ boxShadow: '0 0 12px rgba(182, 0, 168, 0.5)' }}
                          />
                        )}
                        {link.label}
                      </motion.a>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[10px] sm:text-xs text-[#D7E2EA]/40 uppercase tracking-widest font-light border-t border-[#D7E2EA]/5 pt-6 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <a href={`mailto:${personalEmail}`} className="hover:text-white transition-colors cursor-pointer">{personalEmail}</a>
                    <a href="https://wa.me/919030649777" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">{personalPhone}</a>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://github.com/JAY4IGNITE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium cursor-pointer">GitHub</a>
                    <a href="https://www.linkedin.com/in/jay4ignite/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium cursor-pointer">LinkedIn</a>
                    <a href="https://www.instagram.com/krishnaaw_14/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium cursor-pointer">Instagram</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              ★ HERO HEADING — with horizontal parallax split
              "HI, I'M" drifts left, "KRISHNA" drifts right as you scroll
              ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {!isScrolling && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3 }}
                className="overflow-visible mt-6 sm:mt-4 md:-mt-5 relative z-0 w-auto -mx-6 md:-mx-10"
              >
                <motion.div
                  style={{ y: headingY, opacity: headingOpacity }}
                  className="relative w-full"
                >
                  <h1 className="font-black uppercase tracking-tighter leading-[1.1] w-full text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14vw] overflow-visible py-4 px-4 sm:px-6 md:px-8 flex justify-between items-center">
                    <motion.span
                      className="hero-heading-split pl-2 pr-4"
                      style={{ x: headingSplitLeft }}
                    >
                      Hi, i&apos;m{' '}
                    </motion.span>
                    <motion.span
                      className="hero-heading-split pl-2 pr-6 sm:pr-8 md:pr-10"
                      style={{ x: headingSplitRight }}
                    >
                      KRISHNA
                    </motion.span>
                  </h1>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 pointer-events-none" />

          {/* ── Portrait ────────────────────────────────────────────────── */}
          <div className="absolute inset-0 z-10 flex justify-center items-center pt-20 sm:pt-28 md:pt-36 pointer-events-none">
            <FadeIn delay={0.6} y={0} className="w-full pointer-events-auto">
              <SlicedParallaxPortrait scrollYProgress={scrollYProgress} />
            </FadeIn>
          </div>

          {/* ── Bottom tagline with parallax ─────────────────────────────── */}
          <AnimatePresence>
            {!isScrolling && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-7 sm:pb-8 md:pb-10 gap-4 sm:gap-0 z-20"
              >
                <motion.p
                  className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] parallax-layer"
                  style={{
                    fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)',
                    y: taglineY,
                  }}
                >
                  a web developer driven by crafting striking and unforgettable projects
                </motion.p>

                {/* ── Scroll indicator ──────────────────────────────────── */}
                <motion.div
                  className="flex flex-col items-center gap-2 text-[#D7E2EA]/30 text-[9px] uppercase tracking-[0.3em]"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#B600A8] to-transparent" />
                  Scroll
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Signature scrub (outside the scaling wrapper so it's full-size) ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none drop-shadow-2xl">
          <motion.div
            className="w-[90vw] max-w-[850px] text-center select-none"
            style={{
              clipPath: signatureClip,
              overflow: 'visible',
              transform: 'rotate(-8deg) translateY(80px)',
              color: '#DFFF00',
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(4.5rem, 18vw, 12rem)',
              fontWeight: 400,
            }}
          >
            Krishna
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;