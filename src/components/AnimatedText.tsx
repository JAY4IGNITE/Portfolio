import { useRef, memo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={`relative ${className}`}>
      {chars.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          total={chars.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

interface AnimatedCharProps {
  char: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const AnimatedChar = memo(({ char, index, total, scrollYProgress }: AnimatedCharProps) => {
  const start = index / total;
  const end = start + 1 / total;

  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  const blur = useTransform(scrollYProgress, [start, end], [4, 0]);
  const y = useTransform(scrollYProgress, [start, end], [8, 0]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span
        className="absolute left-0 top-0"
        style={{
          opacity,
          y,
          filter: filterBlur,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
});

AnimatedChar.displayName = 'AnimatedChar';

export default AnimatedText;
