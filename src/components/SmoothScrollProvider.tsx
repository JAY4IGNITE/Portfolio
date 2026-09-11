import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * SmoothScrollProvider
 * Initializes Lenis for smooth momentum scrolling and synchronizes it
 * with GSAP's ticker so all ScrollTrigger scrub animations remain in lock-step.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(100);
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll position -> GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's RAF so they share the same frame
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Prevent GSAP from running its own lag-smoothing on top of Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
