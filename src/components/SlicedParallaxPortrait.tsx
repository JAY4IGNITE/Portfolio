/**
 * SlicedParallaxPortrait — WebGL Image Reveal Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Now uses WebGLImageReveal for the mouse-driven reveal effect instead of
 * CSS mask. The WebGL shader pipeline gives instant, fluid, GPU-accelerated
 * brush tracking — inspired by landonorris.com.
 *
 * Retained features:
 *  • Scroll-driven scale-up, parallax rise, and opacity fade
 *  • 3D mouse tilt (holographic card effect)
 *  • Pulsing magenta glow behind portrait
 *  • Parallax offsets passed to the WebGL shader as uniforms
 */

import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import WebGLImageReveal from './WebGLImageReveal';

interface Props {
  scrollYProgress?: MotionValue<number>;
}

export default function SlicedParallaxPortrait({ scrollYProgress }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const fallback = useMotionValue(0);
  const progress = scrollYProgress ?? fallback;

  const smooth = { damping: 20, stiffness: 50, mass: 0.5 };
  const sx = useSpring(mouseX, smooth);
  const sy = useSpring(mouseY, smooth);

  // Track current parallax values for passing to WebGL
  const [parallaxOffsets, setParallaxOffsets] = useState({
    slowX: 0, slowY: 0, fastX: 0, fastY: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  // Parallax fades to 0 as section collapses (scroll > 0.3)
  const intensity = useTransform(progress, [0, 0.3], [1, 0]);

  // Portrait rises on scroll
  const portraitY = useTransform(progress, [0, 1], ['0%', '-20%']);

  // Portrait fades out as section collapses
  const portraitOpacity = useTransform(progress, [0.35, 0.65], [1, 0]);

  // Scroll-driven scale-up
  const portraitScale = useTransform(progress, [0, 0.45], [0.92, 1.15]);

  // 3D mouse tilt — holographic card effect
  const tiltX = useTransform(() => sy.get() * -3 * intensity.get());
  const tiltY = useTransform(() => sx.get() * 3 * intensity.get());

  // Parallax offsets for WebGL shader (slow = base, fast = reveal)
  const slowX = useTransform(() => sx.get() * 10 * intensity.get());
  const slowY = useTransform(() => sy.get() * 10 * intensity.get());
  const fastX = useTransform(() => sx.get() * 40 * intensity.get());
  const fastY = useTransform(() => sy.get() * 40 * intensity.get());

  // Mid-speed parallax for rim/edge highlights
  const midX = useTransform(() => sx.get() * 24 * intensity.get());
  const midY = useTransform(() => sy.get() * 24 * intensity.get());

  // Sync motion values → state for WebGL props
  useEffect(() => {
    const unsubs = [
      slowX.on('change', (v) => setParallaxOffsets((p) => ({ ...p, slowX: v }))),
      slowY.on('change', (v) => setParallaxOffsets((p) => ({ ...p, slowY: v }))),
      fastX.on('change', (v) => setParallaxOffsets((p) => ({ ...p, fastX: v }))),
      fastY.on('change', (v) => setParallaxOffsets((p) => ({ ...p, fastY: v }))),
    ];
    return () => unsubs.forEach((u) => u());
  }, [slowX, slowY, fastX, fastY]);

  // Glow intensity increases on scroll
  const glowOpacity = useTransform(progress, [0, 0.3, 0.55], [0.18, 0.35, 0.12]);
  const glowScale = useTransform(progress, [0, 0.3], [1, 1.3]);

  // Check if device has mouse (no reveal on touch)
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(!window.matchMedia('(hover: hover)').matches);
  }, []);

  const baseSrc = `${import.meta.env.BASE_URL}assets/Nandu.png`;
  const revealSrc = `${import.meta.env.BASE_URL}assets/Nandu-2.png`;

  return (
    <motion.div
      className="relative flex justify-center items-end h-[70vh] sm:h-[85vh] md:h-[100vh] lg:h-[115vh] xl:h-[125vh] w-full max-w-4xl mx-auto pointer-events-auto parallax-perspective"
      style={{
        y: portraitY,
        opacity: portraitOpacity,
        scale: portraitScale,
        transformOrigin: 'bottom center',
      }}
    >
      {/* ── 3D tilt wrapper ──────────────────────────────────────────── */}
      <motion.div
        className="relative w-full h-full parallax-layer"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── Layer 0: deep shadow / glow (slowest) ──────────────────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none z-0"
          style={{
            x: slowX,
            y: slowY,
            opacity: glowOpacity,
            scale: glowScale,
            background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(182,0,168,0.4) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* ── WebGL Image Reveal (replaces old img layers) ───────────── */}
        {isTouchDevice ? (
          // Touch devices: just show the colour portrait directly
          <img
            src={revealSrc}
            alt="Nandu"
            className="absolute inset-x-0 bottom-0 w-full h-full object-contain object-bottom select-none z-10"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <WebGLImageReveal
            baseSrc={baseSrc}
            revealSrc={revealSrc}
            className="absolute inset-x-0 bottom-0 w-full h-full z-10"
            offsetBaseX={parallaxOffsets.slowX}
            offsetBaseY={parallaxOffsets.slowY}
            offsetRevealX={parallaxOffsets.fastX}
            offsetRevealY={parallaxOffsets.fastY}
          />
        )}

        {/* ── Layer 3: highlight rim (medium speed) ──────────────────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 w-full h-full z-30 pointer-events-none"
          style={{
            x: midX,
            y: midY,
            background: 'radial-gradient(ellipse 30% 80% at 70% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          }}
        />

        {/* ── Layer 4: edge highlights that react to mouse ───────────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 w-full h-full z-[25] pointer-events-none"
          style={{
            x: midX,
            y: midY,
            background: 'radial-gradient(ellipse 40% 30% at 30% 80%, rgba(182,0,168,0.06) 0%, transparent 50%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}