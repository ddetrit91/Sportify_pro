"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CounterNumberProps {
  value: number;
  duration?: number; // Duration in seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

export function CounterNumber({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = " ",
  className = "",
}: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return formatNumber(0, decimals, separator);
  });

  function formatNumber(num: number, dec: number, sep: string): string {
    const fixed = num.toFixed(dec);
    const [intPart, decPart] = fixed.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return dec > 0 && decPart ? `${formattedInt}.${decPart}` : formattedInt;
  }

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const startVal = 0;
    const endVal = value;
    const durationMs = duration * 1000;

    // Smooth sports telemetry easeOutExpo: fast launch, satisfying mechanical settle
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutExpo(progress);

      const currentVal = startVal + (endVal - startVal) * easedProgress;
      setDisplayValue(formatNumber(currentVal, decimals, separator));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(formatNumber(endVal, decimals, separator));
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, duration, decimals, separator]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
