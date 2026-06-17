import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals an element (or its children) when they enter the viewport.
 * Uses a GSAP from() so targets start hidden.
 */
export function useRevealOnScroll(
    selector: string,
    fromVars: gsap.TweenVars = { y: 60, opacity: 0 },
    toVars: gsap.TweenVars = { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    stagger: number = 0.12
) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(selector, fromVars, {
                ...toVars,
                stagger,
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [selector, stagger]);

    return ref;
}