"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { haptic } from "@/lib/haptics";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  pullFactor?: number; // How far the button moves towards mouse (default: 0.28)
  maxOffset?: number; // Maximum offset in px (default: 8)
  onClick?: (e: React.MouseEvent) => void;
  playHaptic?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  pullFactor = 0.28,
  maxOffset = 8,
  onClick,
  playHaptic = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 16, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * pullFactor;
    const deltaY = (e.clientY - centerY) * pullFactor;

    // Clamp to maxOffset
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (playHaptic) {
      haptic.click();
    }
    if (onClick) {
      onClick(e);
    }
  };

  if (isTouch) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ x: smoothX, y: smoothY }}
      className={`inline-block cursor-pointer will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
