"use client";

import React, { useRef } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";

interface VelocityParallaxProps {
  children: React.ReactNode;
  speed?: number; // Parallax speed multiplier (default: 0.15)
  className?: string;
}

export function VelocityParallax({
  children,
  speed = 0.15,
  className = "",
}: VelocityParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 250 });

  // Parallax displacement based on scroll progress
  const y = useTransform(scrollYProgress, [0, 1], [-25 * speed, 25 * speed]);

  // Subtle velocity-based motion blur (clamped to max 1.2px to maintain performance & crispness)
  const blur = useTransform(smoothVelocity, [-2000, 0, 2000], [1.2, 0, 1.2]);
  const filter = useTransform(blur, (b) => (b > 0.1 ? `blur(${b}px)` : "none"));

  return (
    <motion.div
      ref={ref}
      style={{ y, filter }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
