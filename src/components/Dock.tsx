'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  useEffect,
  useRef,
  useState,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import './Dock.css';

export interface DockItemData {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export interface DockSpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  spring?: DockSpringConfig;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
}

interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: DockSpringConfig;
  distance: number;
  magnification: number;
  baseItemSize: number;
  label: string;
  isActive?: boolean;
}

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  isActive = false,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={handleClick}
      className={`dock-item ${isActive ? 'active' : ''} ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(
            child as ReactElement<{ isHovered?: MotionValue<number> }>,
            { isHovered }
          );
        }
        return child;
      })}
    </motion.div>
  );
}

export function DockLabel({
  children,
  className = '',
  ...rest
}: {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -4, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -4, x: '-50%' }}
          transition={{ duration: 0.15 }}
          className={`dock-label ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 180, damping: 14 },
  magnification = 48,
  distance = 120,
  panelHeight = 44,
  baseItemSize = 34,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      style={{ height: panelHeight, scrollbarWidth: 'none' }}
      className="dock-outer"
    >
      <div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
            isActive={item.isActive}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  );
}
