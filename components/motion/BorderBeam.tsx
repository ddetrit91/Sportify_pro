"use client";

import React from "react";
import { motion } from "framer-motion";

interface BorderBeamProps {
  className?: string;
  size?: number; // Size in px or beam length
  duration?: number; // Duration of one full perimeter cycle in seconds (default: 8)
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number; // Border thickness in px (default: 1.5)
}

export function BorderBeam({
  className = "",
  duration = 7,
  colorFrom = "#d4ff00",
  colorTo = "rgba(212,255,0,0)",
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      style={{
        padding: `${borderWidth}px`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg 280deg, ${colorFrom} 335deg, ${colorTo} 360deg)`,
        }}
        className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] origin-center"
      />
    </div>
  );
}
