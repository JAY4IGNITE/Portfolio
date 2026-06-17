import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useTransform, useInView } from 'framer-motion';

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  delay?: number;
}

export default function CountUp({ target, duration = 2, className = '', delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);

  // Round the interpolated value for display
  const displayValue = useTransform(motionValue, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (isInView && target > 0) {
      // Small delay before starting the countup to match other staggered elements
      const timeout = setTimeout(() => {
        animate(motionValue, target, {
          duration,
          ease: 'easeOut',
        });
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, target, duration, delay, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}
