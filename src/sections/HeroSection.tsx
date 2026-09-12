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

import { useState, useRef } from 'react';
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

const HeroSection = () => {
  const [isScrolling, setIsScrolling] = useState(false);
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
          {/* Top spacing to accommodate the top floating dock menu */}
          <div className="w-full pt-16 sm:pt-20 md:pt-24" />

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

          {/* ── Bottom tagline & availability with parallax ───────────── */}
          <AnimatePresence>
            {!isScrolling && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end pb-7 sm:pb-8 md:pb-10 gap-6 sm:gap-4 z-20"
              >
                {/* Left: Bio Statement */}
                <motion.div
                  style={{ y: taglineY }}
                  className="max-w-[260px] sm:max-w-[280px] md:max-w-[340px] parallax-layer"
                >
                  <p className="text-[#D7E2EA] font-medium uppercase tracking-[0.06em] text-[11px] sm:text-xs md:text-sm leading-relaxed">
                    ENGINEERING HIGH-IMPACT WEB PLATFORMS, REAL-TIME AI SYSTEMS, AND SCALABLE DIGITAL EXPERIENCES.
                  </p>
                </motion.div>

                {/* Center: Scroll indicator */}
                <motion.div
                  className="hidden md:flex flex-col items-center gap-2 text-[#D7E2EA]/30 text-[9px] uppercase tracking-[0.3em] mb-1"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#B600A8] to-transparent" />
                  Scroll
                </motion.div>

                {/* Right: Availability & Socials */}
                <motion.div
                  style={{ y: taglineY }}
                  className="max-w-[260px] sm:max-w-[280px] md:max-w-[340px] flex flex-col items-start sm:items-end sm:text-right parallax-layer"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
                    <a
                      href="https://www.instagram.com/krishnaaw_14/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D7E2EA] uppercase bg-white/5 hover:bg-[#B600A8]/20 border border-white/10 hover:border-[#B600A8]/40 transition-all duration-300"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://github.com/JAY4IGNITE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D7E2EA] uppercase bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/jay4ignite/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#D7E2EA] uppercase bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      LinkedIn
                    </a>
                  </div>
                  <p className="text-[#D7E2EA] font-medium uppercase tracking-[0.06em] text-[11px] sm:text-xs md:text-sm leading-relaxed">
                    OPEN TO INTERNSHIPS, FREELANCE PROJECTS, INTERESTING PROBLEMS TO SOLVE AND COLLABORATION.
                  </p>
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