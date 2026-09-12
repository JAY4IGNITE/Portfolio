import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: 'sparkle' | 'circle';
}

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  // Raw mouse coordinates — zero lag 1:1 hardware tracking for the dot
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spawn lightweight stardust sparkles on movement
  const spawnParticles = useCallback((mx: number, my: number) => {
    const dx = mx - lastMousePos.current.x;
    const dy = my - lastMousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 4) return;

    // Cap particle pool for peak performance (max 24)
    if (particlesRef.current.length > 24) {
      particlesRef.current.splice(0, particlesRef.current.length - 20);
    }

    const count = Math.min(Math.floor(dist / 8), 2);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = lastMousePos.current.x + dx * t;
      const y = lastMousePos.current.y + dy * t;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.15;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed + dx * 0.02,
        vy: Math.sin(angle) * speed + dy * 0.02 - 0.1,
        size: Math.random() * 3.5 + 1.5,
        alpha: 0.85,
        decay: Math.random() * 0.025 + 0.025,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type: Math.random() > 0.4 ? 'sparkle' : 'circle',
      });
    }

    lastMousePos.current = { x: mx, y: my };
  }, []);

  // Lightweight particle rendering loop on 2D canvas
  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;

      const particles = particlesRef.current;

      if (particles.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
          p.rotation += p.rotationSpeed;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = '#FFFFFF';

          if (p.type === 'sparkle') {
            const outer = p.size;
            const inner = p.size * 0.28;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -outer);
            ctx.lineTo(inner, -inner);
            ctx.lineTo(outer, 0);
            ctx.lineTo(inner, inner);
            ctx.lineTo(0, outer);
            ctx.lineTo(-inner, inner);
            ctx.lineTo(-outer, 0);
            ctx.lineTo(-inner, -inner);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      } else if (canvas.width > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice]);

  // Mouse and window event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };
    mediaQuery.addEventListener?.('change', handleMediaChange);

    if (mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener?.('change', handleMediaChange);
      };
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      mouseX.set(mx);
      mouseY.set(my);
      if (!isVisible) setIsVisible(true);

      spawnParticles(mx, my);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
    };
    const handleBlur = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      mediaQuery.removeEventListener?.('change', handleMediaChange);
    };
  }, [mouseX, mouseY, isVisible, spawnParticles]);

  if (isTouchDevice) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden mix-blend-difference"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
      }}
    >
      {/* Canvas for trailing stardust sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />

      {/* Precision Dot — Constant dot at all times; never expands, never morphs into shapes */}
      <motion.div
        className="absolute top-0 left-0 bg-white rounded-full pointer-events-none"
        animate={{
          scale: isPressed ? 0.75 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
};

export default CustomCursor;
