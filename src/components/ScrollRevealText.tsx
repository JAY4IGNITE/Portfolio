/**
 * ScrollRevealText
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses SplitType to break a heading into characters/words, then scrubs their
 * reveal via GSAP ScrollTrigger — exactly the style seen on landonorris.com.
 *
 * Props
 *  text         - the string to render
 *  as           - "h1" | "h2" | "h3" | "h4" | "p" | "span" (default "h2")
 *  splitBy      - "chars" | "words" | "lines" (default "chars")
 *  className    - extra Tailwind classes
 *  scrub        - true = tied to scroll progress, false = one-shot play on enter
 *  delay        - stagger delay between items (seconds)
 *  triggerStart - GSAP ScrollTrigger start string (default "top 85%")
 */

import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  splitBy?: 'chars' | 'words' | 'lines';
  className?: string;
  scrub?: boolean;
  delay?: number;
  triggerStart?: string;
  from?: gsap.TweenVars;
}

export default function ScrollRevealText({
  text,
  as: Tag = 'h2',
  splitBy = 'chars',
  className = '',
  scrub = false,
  delay = 0.025,
  triggerStart = 'top 85%',
  from,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Split the text
    const split = new SplitType(el, { types: splitBy });
    const targets =
      splitBy === 'chars' ? split.chars :
        splitBy === 'words' ? split.words :
          split.lines;

    if (!targets || targets.length === 0) return;

    const defaultFrom: gsap.TweenVars =
      splitBy === 'chars'
        ? { opacity: 0, y: '110%', rotateZ: 8, transformOrigin: 'bottom left' }
        : { opacity: 0, y: 60 };

    const fromVars = from ?? defaultFrom;

    // Wrap each element in a clip container so y-overflow is hidden (mask effect)
    if (splitBy === 'chars') {
      targets.forEach((t) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.verticalAlign = 'bottom';
        t.parentNode?.insertBefore(wrapper, t);
        wrapper.appendChild(t);
      });
    }

    gsap.set(targets, fromVars);

    const anim = gsap.to(targets, {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      duration: scrub ? 1 : 0.7,
      ease: 'power3.out',
      stagger: scrub ? 0 : delay,
      scrollTrigger: scrub
        ? {
            trigger: el,
            start: triggerStart,
            end: 'bottom 20%',
            scrub: 1.5,
          }
        : {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
      split.revert();
    };
  }, [text, splitBy, scrub, delay, triggerStart, from]);

  const sharedProps = {
    className: `overflow-hidden ${className}`,
  };

  if (Tag === 'h1') return <h1 ref={ref as React.RefObject<HTMLHeadingElement>} {...sharedProps}>{text}</h1>;
  if (Tag === 'h3') return <h3 ref={ref as React.RefObject<HTMLHeadingElement>} {...sharedProps}>{text}</h3>;
  if (Tag === 'h4') return <h4 ref={ref as React.RefObject<HTMLHeadingElement>} {...sharedProps}>{text}</h4>;
  if (Tag === 'p') return <p ref={ref as React.RefObject<HTMLParagraphElement>} {...sharedProps}>{text}</p>;
  if (Tag === 'span') return <span ref={ref as React.RefObject<HTMLSpanElement>} {...sharedProps}>{text}</span>;
  return <h2 ref={ref as React.RefObject<HTMLHeadingElement>} {...sharedProps}>{text}</h2>;
}