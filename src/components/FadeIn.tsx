import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

const motionMap = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  nav: motion.nav,
  header: motion.header,
  footer: motion.footer,
  main: motion.main,
  ul: motion.ul,
  li: motion.li,
} as const;

type MotionTag = keyof typeof motionMap;

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: MotionTag;
}

const FadeIn = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  as = 'div',
}: FadeInProps) => {
  const MotionComponent = motionMap[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default FadeIn;
