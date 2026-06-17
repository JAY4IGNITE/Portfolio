/**
 * HeroSection — Lando Norris-inspired Multi-Layer Parallax
 * ─────────────────────────────────────────────────────────────────────────────
 * Overhaul highlights:
 *  1. Extended 400vh scroll runway for more dramatic parallax travel
 *  2. 5 depth layers: bg-text → particles → floating orbs → portrait → heading
 *  3. Heading splits horizontally: "HI, I'M" goes left, "NANDU" goes right
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

const personalEmail = import.meta.env.VITE_PERSONAL_EMAIL || '';
const personalPhone = import.meta.env.VITE_PERSONAL_PHONE || '';

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
  const rawScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.55]);
  const contentScale = useSpring(rawScale, { stiffness: 100, damping: 30 });

  // ── Multi-layer parallax transforms ───────────────────────────────────
  // Heading split: "HI, I'M" goes left, "NANDU" goes right
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
          <ParticleField text="NANDU" />
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
          className="relative z-10 w-full h-full flex flex-col px-6 md:px-10 bg-black/80 origin-center overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]"
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
                    <p>{personalEmail}</p>
                    <p>{personalPhone}</p>
                  </div>
                  <div className="flex gap-4">
                    <a href="https://github.com/NandiVardhan2007" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium cursor-pointer">GitHub</a>
                    <a href="https://www.linkedin.com/in/nandi-vardhan-reddy-kovvuri-295a10375" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium cursor-pointer">LinkedIn</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              ★ HERO HEADING — with horizontal parallax split
              "HI, I'M" drifts left, "NANDU" drifts right as you scroll
              ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {!isScrolling && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 relative z-0"
              >
                <motion.div
                  style={{ y: headingY, opacity: headingOpacity }}
                  className="parallax-layer"
                >
                  <h1 className="font-black uppercase tracking-tighter leading-none w-full text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14vw] overflow-hidden">
                    <motion.span
                      className="hero-heading-split"
                      style={{ x: headingSplitLeft }}
                    >
                      Hi, i&apos;m{' '}
                    </motion.span>
                    <motion.span
                      className="hero-heading-split"
                      style={{ x: headingSplitRight }}
                    >
                      nandu
                    </motion.span>
                  </h1>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 pointer-events-none" />

          {/* ── Portrait ────────────────────────────────────────────────── */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pointer-events-none">
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
          <motion.svg
            viewBox="-1.96 12.08 66.4 28.92"
            className="w-[80vw] max-w-[600px] h-auto transform rotate-[-5deg]"
            style={{ clipPath: signatureClip, overflow: 'visible' }}
          >
            <path
              d="M21.32 12.68L21.32 12.68Q21.32 12.80 21.24 13.04Q21.16 13.28 21.04 13.56Q20.92 13.84 20.80 14.10Q20.68 14.36 20.64 14.48L20.64 14.48Q20.20 16.28 19.80 19.08Q19.40 21.88 19.04 25.72L19.04 25.72Q18.72 29.40 18.54 32.44Q18.36 35.48 18.36 37.96L18.36 37.96Q18.36 38.20 18.46 38.64Q18.56 39.08 18.56 39.28L18.56 39.28Q18.56 40.20 16.76 40.20L16.76 40.20Q15.12 40.20 14.24 38.72L14.24 38.72Q13.92 38.32 12.92 35.12L12.92 35.12Q11.88 32 10.94 27.66Q10 23.32 9.12 17.60L9.12 17.60Q8.84 18.64 8.44 21.16Q8.04 23.68 7.48 27.68L7.48 27.68Q6.60 34.08 5.44 36.96L5.44 36.96Q3.80 41 0.64 41L0.64 41Q-1.96 41-1.96 39.68L-1.96 39.68Q-1.96 39.04-1.44 39.04L-1.44 39.04Q-1.20 39.04-1.04 39.20L-1.04 39.20Q-1.20 39.36-1.20 39.48L-1.20 39.48Q-1.20 39.96-0.12 39.96L-0.12 39.96Q4.56 39.96 6.76 25.20L6.76 25.20Q7.96 17.28 7.96 13.92L7.96 13.92Q7.96 13.40 7.92 13.28L7.92 13.28Q8.56 12.28 9.48 12.28L9.48 12.28Q11.56 12.28 11.56 13.72L11.56 13.72Q11.56 23.60 13.24 31.08L13.24 31.08Q14.80 38.04 16.40 38.04L16.40 38.04Q17.08 38.04 17.16 35.88L17.16 35.88L17.40 30.48Q17.56 28.68 17.80 26.08Q18.04 23.48 18.36 19.96L18.36 19.96Q19.04 14.04 20.52 12.08L20.52 12.08Q21.32 12.20 21.32 12.68ZM25.80 29.44L25.32 28.80Q25.16 26.96 24.32 26.96L24.32 26.96Q23.64 26.96 23.12 28.88L23.12 28.88Q22.96 29.32 22.76 30.04Q22.56 30.76 22.28 31.68L22.28 31.68Q21.64 34.12 21.64 37.72L21.64 37.72Q21.64 38.40 21.92 39L21.92 39Q22.28 39.76 22.84 39.76L22.84 39.76Q23.60 39.32 24.44 36.68L24.44 36.68Q24.76 35.64 25 34.74Q25.24 33.84 25.32 33.12L25.32 33.12L25.80 29.44ZM27.76 40L27.76 40Q26.28 40 25.32 37.08L25.32 37.08Q24.28 40.80 22.64 40.80L22.64 40.80Q20.28 40.80 20.40 34.96L20.40 34.96Q20.48 33.40 21.40 29.76L21.40 29.76Q22.56 25.60 23.36 25.60L23.36 25.60Q25.12 25.60 25.60 26.52L25.60 26.52L26.32 27.96L27.72 28.44Q26.72 31.36 26.36 35.60L26.36 35.60Q26.28 36.52 26.52 37.52L26.52 37.52Q26.84 38.92 27.52 38.92L27.52 38.92Q28.88 38.92 31.24 29.08L31.24 29.08Q31.48 28.16 31.80 28.16L31.80 28.16Q32.12 28.16 32.12 28.76L32.12 28.76Q32.12 30.24 30.64 34.80L30.64 34.80Q28.96 40 27.76 40ZM43.44 28.76L43.44 28.76Q43.44 29.88 42.04 34.20L42.04 34.20Q40.12 40 38.96 40L38.96 40Q37.48 40 36.92 37.16L36.92 37.16Q36.76 36.36 36.64 34.66Q36.52 32.96 36.40 30.28L36.40 30.28Q36.20 31 35.66 32.94Q35.12 34.88 34.32 38.12L34.32 38.12Q33.92 39.84 33.08 39.84L33.08 39.84Q31.84 39.84 31.56 38.16L31.56 38.16L31.40 35.16Q31.28 33.40 31.40 31.96L31.40 31.96L31.52 30.48L31.16 29.72Q31.20 28.64 31.36 28.28L31.36 28.28Q31.60 27.64 32.36 27.64L32.36 27.64Q33.16 27.64 33.16 28.36L33.16 28.36Q33.16 28.60 32.88 29.40L32.88 29.40Q32.64 30.20 32.64 30.68L32.64 30.68Q32.64 31.04 32.64 31.60L32.64 31.60Q32.64 32.12 32.60 32.84L32.60 32.84Q32.56 33.56 32.56 34.12L32.56 34.12Q32.56 34.64 32.56 35L32.56 35Q32.56 37.88 33.20 37.88L33.20 37.88Q33.40 37.88 33.72 36.84L33.72 36.84Q34.28 34.52 34.56 33.80L34.56 33.80Q35.12 32 35.48 30.48Q35.84 28.96 35.92 27.60L35.92 27.60Q36.04 25.92 36.48 25.60L36.48 25.60Q38.52 25.72 38.52 26.88L38.52 26.88Q38.52 26 38.40 26.56Q38.28 27.12 38.08 29.16L38.08 29.16Q37.88 31.16 37.78 32.42Q37.68 33.68 37.68 34.24L37.68 34.24Q37.68 38.56 38.80 38.56L38.80 38.56Q39.76 38.56 41.12 34.32L41.12 34.32Q41.52 33.08 41.86 31.86Q42.20 30.64 42.48 29.40L42.48 29.40Q42.76 28.16 43.12 28.16L43.12 28.16Q43.44 28.16 43.44 28.76ZM46.04 26.40L46.04 26.40Q44.72 26.40 43.60 30.36L43.60 30.36Q42.68 33.68 42.68 35.52L42.68 35.52Q42.68 39.40 43.56 39.40L43.56 39.40Q44.44 39.40 45.60 36.44L45.60 36.44Q46.04 35.32 46.36 34.28Q46.68 33.24 46.88 32.28L46.88 32.28Q46.92 32.04 46.96 31.54Q47 31.04 47.08 30.24L47.08 30.24Q47.16 29.60 47.20 29.10Q47.24 28.60 47.24 28.20L47.24 28.20Q47.24 26.40 46.04 26.40ZM48.80 39.04L48.80 39.04Q49.52 39.04 50.84 35L50.84 35Q51.72 32.36 52.52 29.08L52.52 29.08Q52.76 28.16 53.08 28.16L53.08 28.16Q53.40 28.16 53.40 28.76L53.40 28.76Q53.40 30.12 51.84 34.84L51.84 34.84Q50.08 40.08 49.04 40.08L49.04 40.08Q47.16 40.08 46.80 36.12L46.80 36.12Q46.36 37.24 46.06 37.88Q45.76 38.52 45.64 38.72L45.64 38.72Q44.68 40.52 43.72 40.52L43.72 40.52Q42.48 40.52 41.80 39L41.80 39Q41.28 37.92 41.28 36.36L41.28 36.36Q41.28 33.16 42.52 29.08L42.52 29.08Q43.92 24.56 45.44 24.56L45.44 24.56Q45.96 24.56 46.68 25.16L46.68 25.16Q47.44 25.72 47.48 25.72L47.48 25.72Q47.56 25.72 47.64 25.60L47.64 25.60Q47.88 23.72 48.26 20.88Q48.64 18.04 49.16 14.16L49.16 14.16Q49.04 13.08 49.52 12.92L49.52 12.92Q49.68 12.88 50.20 12.88L50.20 12.88Q51.16 12.88 51 14.08L51 14.08Q50.76 15.32 50.40 17.26Q50.04 19.20 49.52 21.84L49.52 21.84Q49.48 22.12 49.24 23.98Q49 25.84 48.56 29.36L48.56 29.36Q48.24 32 48.06 33.68Q47.88 35.36 47.88 36.04L47.88 36.04Q47.96 38.88 48.80 39.04ZM59.76 39.56L59.76 39.56Q58.88 39.56 58.24 38.24L58.24 38.24Q58.08 38 57.52 36.16L57.52 36.16Q57.24 36.84 56.92 37.58Q56.60 38.32 56.28 39.12L56.28 39.12Q55.56 40.36 54.40 40.36L54.40 40.36Q53.36 40.36 52.76 39.16L52.76 39.16Q52.28 38.16 52.28 37L52.28 37Q52.28 36.16 52.32 34.94Q52.36 33.72 52.44 32.08L52.44 32.08Q52.60 28 52.88 27.56L52.88 27.56Q53.08 27.24 53.56 27.24L53.56 27.24Q53.96 27.24 54.28 27.58Q54.60 27.92 54.60 28.32L54.60 28.32Q54.60 28.72 54.44 29.24L54.44 29.24Q54.36 29.64 54.30 29.86Q54.24 30.08 54.20 30.16L54.20 30.16Q53.92 31.72 53.78 33.58Q53.64 35.44 53.64 37.60L53.64 37.60Q53.64 39.36 54.40 39.36L54.40 39.36Q55 39.36 55.52 38.36L55.52 38.36Q55.72 37.96 55.88 37.58Q56.04 37.20 56.20 36.80L56.20 36.80Q57.08 34.72 57.52 31.60L57.52 31.60Q57.56 31.52 57.62 31.08Q57.68 30.64 57.80 29.88L57.80 29.88Q57.88 29.32 57.94 28.90Q58 28.48 58 28.16L58 28.16Q58 27.24 58 26.88L58 26.88Q58 26.48 57.96 26.64L57.96 26.64Q58.08 25.60 58.76 25.68L58.76 25.68Q59.92 25.68 59.92 26.32L59.92 26.32Q59.92 26.52 59.70 26.98Q59.48 27.44 59.44 27.80L59.44 27.80Q59.44 27.96 59.34 28.70Q59.24 29.44 59.04 30.80L59.04 30.80Q58.88 31.92 58.80 32.84Q58.72 33.76 58.72 34.48L58.72 34.48Q58.72 38.28 59.88 38.28L59.88 38.28Q60.96 38.28 62.20 34.04L62.20 34.04Q62.68 32.32 63.64 28.76L63.64 28.76Q63.80 28.16 64.12 28.16L64.12 28.16Q64.44 28.16 64.44 28.64L64.44 28.64Q64.44 30.04 63.08 34.24L63.08 34.24Q61.40 39.56 59.76 39.56Z"
              fill="#DFFF00"
            />
          </motion.svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;