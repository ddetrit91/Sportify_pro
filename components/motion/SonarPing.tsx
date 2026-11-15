"use client";

import React from "react";

interface SonarPingProps {
  color?: string; // Tailwind bg color class or hex, default volt #d4ff00
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SonarPing({
  color = "bg-[#d4ff00]",
  size = "md",
  className = "",
}: SonarPingProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const ringSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${ringSizes[size]} ${className}`}>
      {/* Sonar Ring 1 */}
      <span
        className={`absolute inset-0 rounded-full ${color} opacity-40 animate-ping [animation-duration:2.4s]`}
      />
      {/* Sonar Ring 2 (Staggered offset) */}
      <span
        className={`absolute inset-1 rounded-full ${color} opacity-30 animate-ping [animation-duration:2.4s] [animation-delay:1.1s]`}
      />
      {/* Central Solid Beacon */}
      <span className={`relative z-10 rounded-full ${color} ${sizeClasses[size]} shadow-[0_0_8px_rgba(212,255,0,0.8)]`} />
    </span>
  );
}
