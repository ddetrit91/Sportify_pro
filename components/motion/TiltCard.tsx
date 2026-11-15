"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default: 6)
  glareOpacity?: number; // Maximum opacity of moving specular glare (default: 0.22)
  perspective?: number; // Perspective distance (default: 1200)
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  glareOpacity = 0.22,
  perspective = 1200,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 280, damping: 24, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  // Glare spotlight position in percentage
  const glareX = useTransform(smoothX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothY, [0, 1], [0, 100]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      const relativeY = (e.clientY - rect.top) / rect.height;
      x.set(relativeX);
      y.set(relativeY);
    },
    [isTouch, x, y]
  );

  const handleMouseEnter = () => {
    if (!isTouch) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  if (isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="relative w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full h-full will-change-transform ${className}`}
      >
        {children}

        {/* Dynamic Specular Glare / Spotlight that tracks mouse */}
        <motion.div
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.3) 0%, rgba(212,255,0,0.12) 30%, transparent 65%)`
            ),
          }}
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300 mix-blend-overlay"
        />
      </motion.div>
    </div>
  );
}
