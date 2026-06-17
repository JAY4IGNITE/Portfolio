import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';

type CursorVariant = 'default' | 'button' | 'image' | 'text';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Main ring springs (fast but smooth)
  const ringX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  // Trail springs (decreasing stiffness)
  const trail1X = useSpring(mouseX, { stiffness: 600, damping: 30 });
  const trail1Y = useSpring(mouseY, { stiffness: 600, damping: 30 });
  const trail2X = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const trail2Y = useSpring(mouseY, { stiffness: 400, damping: 30 });
  const trail3X = useSpring(mouseX, { stiffness: 250, damping: 30 });
  const trail3Y = useSpring(mouseY, { stiffness: 250, damping: 30 });
  const trail4X = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const trail4Y = useSpring(mouseY, { stiffness: 150, damping: 30 });
  const trail5X = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const trail5Y = useSpring(mouseY, { stiffness: 80, damping: 30 });

  // Velocity tracking for stretch effect
  const velocityX = useVelocity(ringX);
  const velocityY = useVelocity(ringY);
  const rotation = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  useAnimationFrame(() => {
    if (variant !== 'default') {
      // Return to normal scale/rotation during hover states
      scaleX.set(1);
      scaleY.set(1);
      return;
    }

    const vx = velocityX.get();
    const vy = velocityY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);

    if (speed > 10) {
      rotation.set(Math.atan2(vy, vx) * (180 / Math.PI));
    }

    // Stretch amount based on speed
    const stretchAmount = Math.min(speed / 1500, 0.6);
    scaleX.set(1 + stretchAmount);
    scaleY.set(1 - stretchAmount * 0.5);
  });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Delegate hover detection for interactive elements
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('img, video, canvas')) {
        setVariant('image');
      } else if (target.closest('input, textarea, [contenteditable="true"]')) {
        setVariant('text');
      } else if (target.closest('a, button, [role="button"], label[for], .cursor-pointer')) {
        setVariant('button');
      } else {
        setVariant('default');
      }
    };

    const handlePointerOut = () => {
      // Re-evaluate what we are over, or just set to default if not moving to another interactive element
      // For simplicity, falling back to default. In a real app, `elementFromPoint` or reliable enter/leave on targets is better, 
      // but delegated pointerout is fine if we also handle pointerover correctly.
      setVariant('default');
      
      // Let pointerover immediately override this if moving from one button to another
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    // Using pointerout can sometimes clear the variant right before pointerover sets it, but React state batching usually handles it smoothly.
    document.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice) return null;

  // Render Variants
  const ringVariants = {
    default: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '2px solid rgba(182, 0, 168, 0.8)',
      backgroundColor: 'transparent',
      opacity: 1,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      border: '2px solid rgba(182, 0, 168, 0.2)',
      backgroundColor: 'rgba(182, 0, 168, 0.1)',
      opacity: 1,
    },
    image: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '2px dashed rgba(182, 0, 168, 0.8)',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      opacity: 1,
    },
    text: {
      width: 4,
      height: 28,
      borderRadius: '2px',
      border: 'none',
      backgroundColor: '#B600A8',
      opacity: 1,
    }
  };

  const dotVariants = {
    default: { opacity: 1, scale: 1 },
    button: { opacity: 0, scale: 0 },
    image: { opacity: 0, scale: 0 },
    text: { opacity: 0, scale: 0 },
  };

  const trailProps = [
    { x: trail1X, y: trail1Y, opacity: 0.5, scale: 0.8 },
    { x: trail2X, y: trail2Y, opacity: 0.4, scale: 0.6 },
    { x: trail3X, y: trail3Y, opacity: 0.3, scale: 0.4 },
    { x: trail4X, y: trail4Y, opacity: 0.2, scale: 0.2 },
    { x: trail5X, y: trail5Y, opacity: 0.1, scale: 0.1 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
      
      {/* Ghost Trail Dots */}
      {variant === 'default' && trailProps.map((props, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0"
          style={{
            x: props.x,
            y: props.y,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#B600A8',
            transform: 'translate(-50%, -50%)',
            opacity: props.opacity,
            scale: props.scale,
          }}
        />
      ))}

      {/* Main Dot */}
      <motion.div
        className="absolute top-0 left-0"
        variants={dotVariants}
        animate={variant}
        transition={{ duration: 0.2 }}
        style={{
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#DFFF00',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Morphing Ring with Velocity Stretch */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center"
        variants={ringVariants}
        animate={variant}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          x: ringX,
          y: ringY,
          rotate: rotation,
          scaleX: scaleX,
          scaleY: scaleY,
          transformOrigin: 'center center',
          margin: '-20px 0 0 -20px', // Center offset based on default 40x40 size
        }}
      >
        {/* Crosshair inside image variant */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: variant === 'image' ? 1 : 0 }}
          className="relative w-full h-full"
        >
          <div className="absolute top-1/2 left-1/4 right-1/4 h-[2px] bg-[#DFFF00] -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/4 bottom-1/4 w-[2px] bg-[#DFFF00] -translate-x-1/2" />
        </motion.div>
      </motion.div>

      {/* Ambient glowing blob */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none z-[-1]"
        style={{
          x: trail5X,
          y: trail5Y,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: '#B600A8',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
          opacity: variant === 'default' ? 0.15 : 0,
        }}
      />
    </div>
  );
};

export default CustomCursor;
