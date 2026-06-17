/**
 * ClipRevealImage
 * ─────────────────────────────────────────────────────────────────────────────
 * Reveals an image using a clip-path wipe animation driven by scroll position.
 * The inner image counter-translates (parallax) so it always fills the frame.
 *
 * direction – which edge the wipe starts from: "left" | "right" | "bottom" | "top"
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Direction = 'left' | 'right' | 'top' | 'bottom';

interface Props {
    src: string;
    alt: string;
    className?: string;
    direction?: Direction;
    parallaxStrength?: number; // px the image slides opposite to reveal
    scrub?: boolean;
}

const clipStart: Record<Direction, string> = {
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
    top: 'inset(100% 0% 0% 0%)',
    bottom: 'inset(0% 0% 100% 0%)',
};
const clipEnd = 'inset(0% 0% 0% 0%)';

const parallaxAxis: Record<Direction, 'x' | 'y'> = {
    left: 'x', right: 'x', top: 'y', bottom: 'y',
};

export default function ClipRevealImage({
    src,
    alt,
    className = '',
    direction = 'bottom',
    parallaxStrength = 60,
    scrub = false,
}: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        if (!wrap || !img) return;

        const axis = parallaxAxis[direction];

        const ctx = gsap.context(() => {
            gsap.set(wrap, { clipPath: clipStart[direction] });
            gsap.set(img, {
                [axis]: axis === 'x'
                    ? (direction === 'left' ? -parallaxStrength : parallaxStrength)
                    : (direction === 'top' ? -parallaxStrength : parallaxStrength)
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrap,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: scrub ? undefined : 'play none none none',
                    scrub: scrub ? 1.5 : false,
                },
            });

            tl.to(wrap, { clipPath: clipEnd, duration: 1, ease: 'power3.inOut' }, 0)
                .to(img, { [axis]: 0, duration: 1, ease: 'power3.inOut' }, 0);
        }, wrapRef);

        return () => ctx.revert();
    }, [direction, parallaxStrength, scrub]);

    return (
        <div
            ref={wrapRef}
            className={`overflow-hidden ${className}`}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                draggable={false}
                loading="lazy"
            />
        </div>
    );
}