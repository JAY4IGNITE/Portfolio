/**
 * ParallaxBackgroundText
 * ─────────────────────────────────────────────────────────────────────────────
 * A massive background text element that provides atmospheric depth:
 *  • Sits behind all other hero layers at very low opacity (8–12%)
 *  • Uses enormous font size (20vw+)
 *  • Scrolls at a much slower rate than foreground (0.15x)
 *  • Letter-spacing expands as you scroll
 *  • Gradual blur increase as it scrolls past
 */

import {
  motion,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';

interface Props {
  scrollYProgress: MotionValue<number>;
  text?: string;
}

export default function ParallaxBackgroundText({
  scrollYProgress,
  text = 'DEVELOPER',
}: Props) {
  // Very slow vertical parallax — text barely moves
  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const y = useSpring(rawY, { stiffness: 40, damping: 30 });

  // Letter-spacing expands from tight to wide as user scrolls
  const letterSpacing = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['0.02em', '0.35em']
  );

  // Opacity fades out as section collapses
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 0.75], [0, 0.1, 0.08, 0]);

  // Blur increases as you scroll deeper
  const blurVal = useTransform(scrollYProgress, [0, 0.6], [0, 6]);
  const filter = useTransform(() => `blur(${blurVal.get()}px)`);

  // Subtle scale-down for depth zoom effect
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  return (
    <motion.div
      className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden parallax-layer"
      style={{ y, opacity, filter, scale }}
      aria-hidden="true"
    >
      <motion.span
        className="parallax-bg-text font-black uppercase whitespace-nowrap select-none"
        style={{
          fontSize: 'clamp(8rem, 22vw, 28rem)',
          letterSpacing,
          lineHeight: 1,
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
