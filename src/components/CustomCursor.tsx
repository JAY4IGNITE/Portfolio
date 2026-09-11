import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';

type CursorVariant = 'default' | 'button' | 'image' | 'text' | 'custom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: 'sparkle' | 'circle';
}

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [customText, setCustomText] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: -100, y: -100 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Main ring springs (ultra-responsive, tight spring)
  const ringX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const ringY = useSpring(mouseY, { stiffness: 450, damping: 30 });

  // Velocity for dynamic stretch on the ring
  const velocityX = useVelocity(ringX);
  const velocityY = useVelocity(ringY);
  const rotation = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  // Canvas particle trail animation
  useAnimationFrame(() => {
    // ── Ring Velocity Stretch ────────────────────────
    if (variant === 'default') {
      const vx = velocityX.get();
      const vy = velocityY.get();
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > 8) {
        rotation.set(Math.atan2(vy, vx) * (180 / Math.PI));
      }
      const stretch = Math.min(speed / 1000, 0.4);
      scaleX.set(1 + stretch);
      scaleY.set(1 - stretch * 0.4);
    } else {
      scaleX.set(1);
      scaleY.set(1);
    }

    // ── Canvas Particle Update & Render ──────────────
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // slight gravity
      p.alpha -= p.decay;
      p.rotation += p.rotationSpeed;
      p.size = p.maxSize * (p.alpha > 0 ? p.alpha : 0);

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.type === 'sparkle' ? 6 : 3;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';

      if (p.type === 'sparkle') {
        // Draw 4-pointed sparkle star
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        const outer = p.size;
        const inner = p.size * 0.25;
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
        // Draw soft glowing circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  });

  // Spawn trail particles
  const spawnParticles = (mx: number, my: number) => {
    const dx = mx - lastMousePos.current.x;
    const dy = my - lastMousePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 3) return;

    // Sleek premium white / silver stars palette
    const colors = ['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB'];

    // Spawn 1-2 particles per mouse movement step
    const count = Math.min(Math.floor(dist / 5), 2);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = lastMousePos.current.x + dx * t;
      const y = lastMousePos.current.y + dy * t;

      const color = colors[Math.floor(Math.random() * colors.length)];
      const type = Math.random() > 0.4 ? 'sparkle' : 'circle';
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.6 + 0.15;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (dx * 0.03),
        vy: Math.sin(angle) * speed + (dy * 0.03) - 0.15, // slight upward drift
        size: Math.random() * 4 + 2.5,
        maxSize: Math.random() * 6 + 3.5,
        color,
        alpha: 0.9,
        decay: Math.random() * 0.02 + 0.02, // decay rate
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        type,
      });
    }

    lastMousePos.current = { x: mx, y: my };
  };

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

    // Resize canvas to cover screen
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

      if (variant === 'default') {
        spawnParticles(mx, my);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Delegate hover detection for interactive elements & custom labels
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorTextAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      
      if (cursorTextAttr) {
        setVariant('custom');
        setCustomText(cursorTextAttr);
      } else if (target.closest('img, video, canvas')) {
        setVariant('image');
        setCustomText('');
      } else if (target.closest('input, textarea, [contenteditable="true"]')) {
        setVariant('text');
        setCustomText('');
      } else if (target.closest('a, button, [role="button"], label[for], .cursor-pointer')) {
        setVariant('button');
        setCustomText('');
      } else {
        setVariant('default');
        setCustomText('');
      }
    };

    const handlePointerOut = () => {
      setVariant('default');
      setCustomText('');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      mediaQuery.removeEventListener?.('change', handleMediaChange);
    };
  }, [mouseX, mouseY, isVisible, variant]);

  if (isTouchDevice) return null;

  // Render Variants (Clean white/translucent theme to feel extremely premium)
  const ringVariants = {
    default: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: '1px solid rgba(255, 255, 255, 0.75)',
      backgroundColor: 'transparent',
      opacity: 1,
    },
    button: {
      width: 50,
      height: 50,
      borderRadius: '50%',
      border: '1px solid rgba(255, 255, 255, 0.85)',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      opacity: 1,
    },
    image: {
      width: 46,
      height: 46,
      borderRadius: '50%',
      border: '1px dashed rgba(255, 255, 255, 0.75)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      opacity: 1,
    },
    text: {
      width: 2,
      height: 22,
      borderRadius: '1px',
      border: 'none',
      backgroundColor: '#FFFFFF',
      opacity: 1,
    },
    custom: {
      width: 70,
      height: 70,
      borderRadius: '50%',
      border: '1.5px solid rgba(182, 0, 168, 0.85)',
      backgroundColor: 'rgba(182, 0, 168, 0.95)',
      opacity: 1,
    }
  };

  const dotVariants = {
    default: { opacity: 1, scale: 1 },
    button: { opacity: 0, scale: 0 },
    image: { opacity: 0, scale: 0 },
    text: { opacity: 0, scale: 0 },
    custom: { opacity: 0, scale: 0 },
  };

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" 
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-out' }}
    >
      {/* High-performance canvas for particle stardust trail */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: -1 }}
      />

      {/* Main Center Dot */}
      <motion.div
        className="absolute top-0 left-0"
        variants={dotVariants}
        animate={variant}
        transition={{ duration: 0.15 }}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
        }}
      />

      {/* Morphing Outer Ring */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        variants={ringVariants}
        animate={variant}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          rotate: rotation,
          scaleX: scaleX,
          scaleY: scaleY,
          transformOrigin: 'center center',
        }}
      >
        {/* Crosshair inside image variant */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: variant === 'image' ? 1 : 0 }}
          className="relative w-full h-full"
        >
          <div className="absolute top-1/2 left-1/4 right-1/4 h-[1.5px] bg-[#FFFFFF] -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/4 bottom-1/4 w-[1.5px] bg-[#FFFFFF] -translate-x-1/2" />
        </motion.div>

        {/* Text inside custom variant */}
        {variant === 'custom' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold uppercase tracking-widest text-[#FFFFFF] text-center select-none"
          >
            {customText}
          </motion.span>
        )}
      </motion.div>

      {/* Subtle ambient light glow following the trail */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none z-[-2]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(35px)',
          opacity: variant === 'default' ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      />
    </div>
  );
};

export default CustomCursor;
