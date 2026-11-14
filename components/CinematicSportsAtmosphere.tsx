"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function CinematicSportsAtmosphere() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Global scroll progress across the entire page
  const { scrollYProgress } = useScroll();

  // Multi-plane parallax transforms with varied velocities
  const platesParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const platesParallaxMid = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const platesParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -480]);
  const auroraParallax1 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const auroraParallax2 = useTransform(scrollYProgress, [0, 1], [0, -380]);
  const vectorTrackRotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  // Spring physics for subtle, luxurious interactive lighting on mouse move
  const springConfig = { damping: 32, stiffness: 85, mass: 0.9 };
  const smoothMouseX = useSpring(0, springConfig);
  const smoothMouseY = useSpring(0, springConfig);

  useEffect(() => {
    // Respect user accessibility preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Subtle, high-end spotlight deflection (max 32px)
      smoothMouseX.set(normX * 32);
      smoothMouseY.set(normY * 32);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [smoothMouseX, smoothMouseY]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* =========================================================================
          LAYER 0: FOUNDATION GRADIENT MESH
          Smooth seamless transition directly from Hero bottom edge into deep carbon / slate
          ========================================================================= */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-[#060709] transition-colors duration-500" />

      {/* Top Transition Mask: Dissolves perfectly from Hero Section */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#08090b] via-slate-200/50 to-transparent dark:from-[#08090b] dark:via-[#07080a]/90 z-10" />

      {/* =========================================================================
          LAYER 1: CINEMATIC SPORTS IMAGERY PLATES (PARALLAX + CHIAROSCURO)
          High-end sports moments with dramatic directional lighting & soft DoF
          ========================================================================= */}

      {/* Plate 1: Night Stadium Running Track & Athletic Curves (Behind Trending Sports Bento) */}
      <motion.div
        style={{ y: isReducedMotion ? 0 : platesParallaxSlow }}
        className="absolute top-[2%] -left-[8%] w-[115%] lg:w-[75%] h-[900px] pointer-events-none"
      >
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] opacity-20 dark:brightness-[0.18] dark:contrast-[1.3] dark:saturate-[0.75] dark:opacity-40"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 65% at 45% 45%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 45% 45%, black 20%, transparent 75%)",
            }}
          />
          {/* Subtle directional floodlight beam over track */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d4ff00]/10 via-transparent to-transparent mix-blend-screen opacity-60" />
        </div>
      </motion.div>

      {/* Plate 2: Padel Court Glass & Boxing Ring Atmospheric Mist (Behind Featured Clubs) */}
      <motion.div
        style={{ y: isReducedMotion ? 0 : platesParallaxMid }}
        className="absolute top-[26%] -right-[10%] w-[120%] lg:w-[80%] h-[1050px] pointer-events-none"
      >
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] opacity-15 dark:brightness-[0.16] dark:contrast-[1.35] dark:saturate-[0.7] dark:opacity-35"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 60% at 55% 50%, black 15%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 55% 50%, black 15%, transparent 80%)",
            }}
          />
          {/* Subtle Emerald-Volt court rim glow */}
          <div className="absolute inset-0 bg-gradient-to-bl from-[#10b981]/10 via-[#d4ff00]/5 to-transparent mix-blend-screen opacity-50" />
        </div>
      </motion.div>

      {/* Plate 3: Modern High-Performance Studio & Reformer Architecture (Behind AI Matcher / Quiz) */}
      <motion.div
        style={{ y: isReducedMotion ? 0 : platesParallaxSlow }}
        className="absolute top-[50%] -left-[10%] w-[120%] lg:w-[75%] h-[1000px] pointer-events-none"
      >
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] opacity-15 dark:brightness-[0.15] dark:contrast-[1.25] dark:saturate-[0.8] dark:opacity-35"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 65% at 45% 45%, black 20%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 45% 45%, black 20%, transparent 80%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 via-[#d4ff00]/5 to-transparent mix-blend-screen opacity-50" />
        </div>
      </motion.div>

      {/* Plate 4: Olympic 50m Pool Caustics & Training Stadium (Behind Advantages & Athlete Stories) */}
      <motion.div
        style={{ y: isReducedMotion ? 0 : platesParallaxMid }}
        className="absolute top-[70%] -right-[8%] w-[115%] lg:w-[70%] h-[950px] pointer-events-none"
      >
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] opacity-20 dark:brightness-[0.17] dark:contrast-[1.3] dark:saturate-[0.85] dark:opacity-40"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 50%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 50%, black 20%, transparent 75%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#00f0ff]/12 via-transparent to-transparent mix-blend-screen opacity-60" />
        </div>
      </motion.div>

      {/* =========================================================================
          LAYER 2: VOLUMETRIC STADIUM AURORAS & NEON LIME LIGHTING
          Rich, noticeable, diffused spotlights that shift smoothly with the cursor
          ========================================================================= */}
      <motion.div
        style={{ y: isReducedMotion ? 0 : auroraParallax1 }}
        className="absolute inset-0 w-full h-[125%]"
      >
        {/* Aurora 1: Neon Lime Stadium Flare (Top Left - Behind Sports Bento) */}
        <motion.div
          style={{
            x: isReducedMotion ? 0 : smoothMouseX,
            y: isReducedMotion ? 0 : smoothMouseY,
          }}
          className="absolute top-[4%] -left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#d4ff00]/[0.14] via-[#10b981]/[0.06] to-transparent blur-[160px]"
        />

        {/* Aurora 2: Emerald-Volt Arena Aura (Middle Right - Behind Clubs & AI Quiz) */}
        <motion.div
          style={{
            x: isReducedMotion ? 0 : useTransform(smoothMouseX, (v) => -v * 1.3),
            y: isReducedMotion ? 0 : useTransform(smoothMouseY, (v) => -v * 1.3),
          }}
          className="absolute top-[32%] -right-[12%] w-[900px] h-[900px] rounded-full bg-gradient-to-bl from-[#d4ff00]/[0.15] via-[#00f0ff]/[0.07] to-transparent blur-[175px]"
        />

        {/* Aurora 3: Electric Stadium Frost Flare (Center Left - Behind Advantages & Stories) */}
        <motion.div
          style={{
            x: isReducedMotion ? 0 : smoothMouseX,
            y: isReducedMotion ? 0 : smoothMouseY,
          }}
          className="absolute top-[58%] -left-[12%] w-[850px] h-[850px] rounded-full bg-gradient-to-tr from-[#00f0ff]/[0.12] via-[#d4ff00]/[0.08] to-transparent blur-[165px]"
        />

        {/* Aurora 4: Finish Line Stadium Horizon Flare (Bottom - Behind Final Booking Terminal) */}
        <motion.div
          style={{
            x: isReducedMotion ? 0 : useTransform(smoothMouseX, (v) => v * 0.8),
          }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[1100px] h-[750px] rounded-full bg-gradient-to-t from-[#d4ff00]/[0.18] via-[#d4ff00]/[0.05] to-transparent blur-[190px]"
        />
      </motion.div>

      {/* =========================================================================
          LAYER 3: ATHLETIC STADIUM RUNNING TRACK CONTOURS & VECTOR VELOCITY ARCS
          Precision geometric speed curves (No dots, no particles)
          ========================================================================= */}
      <motion.div
        style={{
          y: isReducedMotion ? 0 : platesParallaxFast,
          rotate: isReducedMotion ? 0 : vectorTrackRotate,
        }}
        className="absolute inset-0 w-full h-[145%] opacity-[0.06] dark:opacity-[0.09]"
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1600 3800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="voltTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d4ff00" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="cyanTrackGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Running Track Lane Curves (Upper Section - Behind Bento) */}
          <path
            d="M -200 450 C 450 320, 1150 720, 1850 540"
            fill="none"
            stroke="url(#voltTrackGrad)"
            strokeWidth="1.5"
            strokeDasharray="10 14"
          />
          <path
            d="M -150 530 C 500 400, 1200 800, 1900 620"
            fill="none"
            stroke="url(#voltTrackGrad)"
            strokeWidth="1"
          />

          {/* Mid-Section Dynamic Velocity Swoop (Behind Clubs & Quiz) */}
          <path
            d="M 1850 1450 C 1100 1280, 350 1750, -200 1580"
            fill="none"
            stroke="url(#cyanTrackGrad)"
            strokeWidth="2"
            strokeDasharray="8 16"
          />
          <path
            d="M 1900 1530 C 1150 1360, 400 1830, -150 1660"
            fill="none"
            stroke="url(#voltTrackGrad)"
            strokeWidth="1"
          />

          {/* Lower Stadium Turn Arc (Behind Advantages & Stories) */}
          <path
            d="M -300 2450 Q 800 2150, 1900 2550"
            fill="none"
            stroke="url(#voltTrackGrad)"
            strokeWidth="1.5"
          />
          <path
            d="M -250 2530 Q 800 2230, 1950 2630"
            fill="none"
            stroke="url(#cyanTrackGrad)"
            strokeWidth="1"
            strokeDasharray="6 12"
          />

          {/* Finish Line Telemetry Axis (Behind Final Booking Terminal) */}
          <line
            x1="-200"
            y1="3300"
            x2="1800"
            y2="3300"
            stroke="url(#voltTrackGrad)"
            strokeWidth="1.5"
            strokeDasharray="16 20"
          />
        </svg>
      </motion.div>

      {/* =========================================================================
          LAYER 4: HIGH-END ARCHITECTURAL TEXTURE & EDGE VIGNETTES
          Soft luxury diagonal micro-grain and lateral depth focusing
          ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 64px,
            rgba(255, 255, 255, 0.3) 64px,
            rgba(255, 255, 255, 0.3) 65px
          )`,
        }}
      />

      {/* Lateral Feathered Vignettes (keeps focus on center content cards in both light & dark themes) */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-100 to-transparent dark:from-[#07080a] z-10 pointer-events-none hidden lg:block transition-colors duration-500" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-100 to-transparent dark:from-[#07080a] z-10 pointer-events-none hidden lg:block transition-colors duration-500" />
    </div>
  );
}
