/**
 * FloatingParallaxElements
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders 8 floating decorative elements at various depths in the hero:
 *  • Gradient orbs — soft blurred circles (magenta, chartreuse, cyan)
 *  • Geometric wireframes — thin-stroke shapes that drift slowly
 * Each element has its own scroll speed, mouse parallax factor, and CSS animation.
 */

import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface Props {
  scrollYProgress: MotionValue<number>;
}

interface FloatingElement {
  id: string;
  type: 'orb' | 'ring' | 'diamond' | 'line';
  /** position as % of container */
  x: string;
  y: string;
  /** size in px */
  size: number;
  /** scroll parallax multiplier (higher = more movement) */
  scrollSpeed: number;
  /** mouse parallax multiplier */
  mouseSpeed: number;
  /** gradient / color */
  color: string;
  /** blur radius */
  blur: number;
  /** base opacity */
  opacity: number;
  /** animation delay offset */
  delay: number;
}

const elements: FloatingElement[] = [
  // ── Orbs ────────────────────────────────────────────────────────────────
  {
    id: 'orb-1', type: 'orb',
    x: '12%', y: '20%', size: 180,
    scrollSpeed: 80, mouseSpeed: 15,
    color: 'radial-gradient(circle, rgba(182,0,168,0.35) 0%, transparent 70%)',
    blur: 60, opacity: 0.6, delay: 0,
  },
  {
    id: 'orb-2', type: 'orb',
    x: '78%', y: '15%', size: 140,
    scrollSpeed: 120, mouseSpeed: 20,
    color: 'radial-gradient(circle, rgba(223,255,0,0.2) 0%, transparent 70%)',
    blur: 50, opacity: 0.5, delay: 0.3,
  },
  {
    id: 'orb-3', type: 'orb',
    x: '85%', y: '65%', size: 200,
    scrollSpeed: 60, mouseSpeed: 10,
    color: 'radial-gradient(circle, rgba(100,180,255,0.18) 0%, transparent 70%)',
    blur: 70, opacity: 0.4, delay: 0.6,
  },
  {
    id: 'orb-4', type: 'orb',
    x: '5%', y: '75%', size: 120,
    scrollSpeed: 100, mouseSpeed: 25,
    color: 'radial-gradient(circle, rgba(182,0,168,0.2) 0%, transparent 70%)',
    blur: 40, opacity: 0.5, delay: 0.15,
  },

  // ── Geometric wireframes ────────────────────────────────────────────────
  {
    id: 'ring-1', type: 'ring',
    x: '20%', y: '40%', size: 90,
    scrollSpeed: 150, mouseSpeed: 30,
    color: 'rgba(182,0,168,0.12)',
    blur: 0, opacity: 0.35, delay: 0.2,
  },
  {
    id: 'ring-2', type: 'ring',
    x: '70%', y: '80%', size: 60,
    scrollSpeed: 180, mouseSpeed: 35,
    color: 'rgba(223,255,0,0.1)',
    blur: 0, opacity: 0.3, delay: 0.5,
  },
  {
    id: 'diamond-1', type: 'diamond',
    x: '90%', y: '35%', size: 40,
    scrollSpeed: 200, mouseSpeed: 40,
    color: 'rgba(255,255,255,0.08)',
    blur: 0, opacity: 0.25, delay: 0.4,
  },
  {
    id: 'line-1', type: 'line',
    x: '35%', y: '85%', size: 100,
    scrollSpeed: 130, mouseSpeed: 18,
    color: 'rgba(182,0,168,0.08)',
    blur: 0, opacity: 0.2, delay: 0.7,
  },
];

export default function FloatingParallaxElements({ scrollYProgress }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { damping: 25, stiffness: 40, mass: 0.8 };
  const sx = useSpring(mouseX, springCfg);
  const sy = useSpring(mouseY, springCfg);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  // Fade out all elements as section collapses
  const containerOpacity = useTransform(scrollYProgress, [0.5, 0.75], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden"
      style={{ opacity: containerOpacity }}
    >
      {elements.map((el) => (
        <FloatingItem
          key={el.id}
          el={el}
          scrollYProgress={scrollYProgress}
          sx={sx}
          sy={sy}
        />
      ))}
    </motion.div>
  );
}

function FloatingItem({
  el,
  scrollYProgress,
  sx,
  sy,
}: {
  el: FloatingElement;
  scrollYProgress: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  // Scroll-driven vertical parallax
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -el.scrollSpeed]
  );

  // Mouse-driven parallax
  const mx = useTransform(() => sx.get() * el.mouseSpeed);
  const my = useTransform(() => sy.get() * el.mouseSpeed);

  // Combined transforms
  const x = useTransform(() => mx.get());
  const y = useTransform(() => scrollY.get() + my.get());

  const renderShape = () => {
    switch (el.type) {
      case 'orb':
        return (
          <div
            className="floating-orb rounded-full"
            style={{
              width: el.size,
              height: el.size,
              background: el.color,
              filter: `blur(${el.blur}px)`,
              opacity: el.opacity,
              animationDelay: `${el.delay * -10}s`,
            }}
          />
        );
      case 'ring':
        return (
          <div
            className="floating-shape"
            style={{
              width: el.size,
              height: el.size,
              borderRadius: '50%',
              border: `1px solid ${el.color}`,
              opacity: el.opacity,
              animationDelay: `${el.delay * -20}s`,
              animationDuration: `${30 + el.delay * 20}s`,
            }}
          />
        );
      case 'diamond':
        return (
          <div
            className="floating-shape"
            style={{
              width: el.size,
              height: el.size,
              border: `1px solid ${el.color}`,
              opacity: el.opacity,
              transform: 'rotate(45deg)',
              animationDelay: `${el.delay * -15}s`,
              animationDuration: `${50 + el.delay * 15}s`,
            }}
          />
        );
      case 'line':
        return (
          <div
            style={{
              width: el.size,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${el.color}, transparent)`,
              opacity: el.opacity,
              transform: `rotate(${el.delay * 120}deg)`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute parallax-layer"
      style={{
        left: el.x,
        top: el.y,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.2,
        delay: 0.8 + el.delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {renderShape()}
    </motion.div>
  );
}
