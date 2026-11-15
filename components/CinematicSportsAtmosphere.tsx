"use client";

import { useEffect, useRef, useState } from "react";

// --- 3D SIMPLEX NOISE ENGINE ---
class SimplexNoise3D {
  private perm: Uint8Array;
  private permMod12: Uint8Array;

  constructor(seed = 31337) {
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;

    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      const j = s % (i + 1);
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  private static readonly grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  noise(xin: number, yin: number, zin: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;

    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
      } else {
        i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;

    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;

    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]] * 3;
      t0 *= t0;
      n0 = t0 * t0 * (SimplexNoise3D.grad3[gi0] * x0 + SimplexNoise3D.grad3[gi0 + 1] * y0 + SimplexNoise3D.grad3[gi0 + 2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 = t1 * t1 * (SimplexNoise3D.grad3[gi1] * x1 + SimplexNoise3D.grad3[gi1 + 1] * y1 + SimplexNoise3D.grad3[gi1 + 2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 = t2 * t2 * (SimplexNoise3D.grad3[gi2] * x2 + SimplexNoise3D.grad3[gi2 + 1] * y2 + SimplexNoise3D.grad3[gi2 + 2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 = t3 * t3 * (SimplexNoise3D.grad3[gi3] * x3 + SimplexNoise3D.grad3[gi3 + 1] * y3 + SimplexNoise3D.grad3[gi3 + 2] * z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

interface Streamline {
  x: number;
  y: number;
  history: { x: number; y: number }[];
  maxHistory: number;
  speed: number;
  width: number;
  tier: "river_core" | "river_halo" | "flank" | "ambient";
  sparkPhase: number;
  sparkSpeed: number;
  hasSpark: boolean;
  alpha: number;
  accentType: "volt" | "cyan" | "emerald" | "amber";
}

export function CinematicSportsAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const simplex = new SimplexNoise3D(7771);

    let animId: number;
    let width = 0;
    let height = 0;

    let isDark = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Scroll state tracking with smooth Hero threshold detection
    let scrollY = window.scrollY;
    let docHeight = document.documentElement.scrollHeight || 5000;

    const handleScroll = () => {
      scrollY = window.scrollY;
      docHeight = document.documentElement.scrollHeight || 5000;

      // Visibility: Fades in when scrolling past Hero section (> 350px)
      const heroThreshold = Math.max(window.innerHeight * 0.45, 360);
      setIsVisible(scrollY > heroThreshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- CINEMATIC CONTINUOUS STREAMLINES (Airy, Deep Muted Palette) ---
    const STREAMLINE_COUNT = width < 768 ? 200 : 380;
    const streamlines: Streamline[] = [];

    // Continuous Section-Aware Meander Center
    // As user scrolls, the central energy artery weaves and branches organically
    const getRiverCenter = (py: number, timeZ: number, scrollProg: number) => {
      const normY = py / (height || 1);

      // Section 1 (Sports): Diagonal from top-center to right
      // Section 2 (Clubs): Broad dual-lane stadium curve
      // Section 3 (AI Quiz): Synaptic serpentine neural channel
      // Section 4 (Advantages & Reviews): Panoramic harmonic wave
      // Section 5 (Booking): Center focal convergence
      const baseCenter = width * (0.42 + 0.16 * Math.sin(scrollProg * Math.PI * 2));
      const meander =
        Math.sin(normY * 2.8 + timeZ * 0.9 + scrollProg * 4.0) * (width * 0.24) +
        Math.cos(normY * 1.4 - timeZ * 0.45 + scrollProg * 2.5) * (width * 0.12);

      return baseCenter + meander;
    };

    const spawnStreamline = (index: number, initialScatter = false, currentProg = 0): Streamline => {
      const ratio = index / STREAMLINE_COUNT;
      let tier: "river_core" | "river_halo" | "flank" | "ambient";
      let widthVal: number;
      let maxHist: number;
      let speedVal: number;
      let alphaVal: number;
      let accent: "volt" | "cyan" | "emerald" | "amber";

      // Color differentiation: Deep emerald, graphite-green & neon-cyan/teal
      if (currentProg > 0.4 && currentProg < 0.65) {
        // AI Quiz zone: deep cyan/teal synaptic lines
        accent = Math.random() < 0.65 ? "cyan" : "emerald";
      } else if (currentProg >= 0.2 && currentProg <= 0.4) {
        // Clubs zone: athletic deep emerald & dark graphite
        accent = Math.random() < 0.55 ? "emerald" : "cyan";
      } else if (currentProg >= 0.65 && currentProg <= 0.85) {
        // Advantages & Reviews: deep forest emerald & subtle cyan
        accent = Math.random() < 0.5 ? "emerald" : "cyan";
      } else {
        // Sports & Booking: deep emerald & petrol cyan
        accent = Math.random() < 0.5 ? "cyan" : "emerald";
      }

      const hasSpark = Math.random() < (currentProg > 0.4 && currentProg < 0.65 ? 0.32 : 0.18);

      if (ratio < 0.20) {
        tier = "river_core";
        widthVal = 1.6 + Math.random() * 1.0; // 1.6 - 2.6px (refined & non-intrusive)
        maxHist = 42 + Math.floor(Math.random() * 20);
        speedVal = 2.2 + Math.random() * 1.4;
        alphaVal = 0.55 + Math.random() * 0.15;
      } else if (ratio < 0.45) {
        tier = "river_halo";
        widthVal = 1.1 + Math.random() * 0.8;
        maxHist = 34 + Math.floor(Math.random() * 16);
        speedVal = 1.8 + Math.random() * 1.2;
        alphaVal = 0.40 + Math.random() * 0.15;
      } else if (ratio < 0.72) {
        tier = "flank";
        widthVal = 0.8 + Math.random() * 0.6;
        maxHist = 26 + Math.floor(Math.random() * 12);
        speedVal = 1.5 + Math.random() * 1.0;
        alphaVal = 0.28 + Math.random() * 0.12;
      } else {
        tier = "ambient";
        widthVal = 0.5 + Math.random() * 0.4;
        maxHist = 20 + Math.floor(Math.random() * 10);
        speedVal = 1.2 + Math.random() * 0.8;
        alphaVal = 0.15 + Math.random() * 0.10;
      }

      // Initial scatter distributes across full height so every pixel is alive immediately
      const sy = initialScatter
        ? Math.random() * height
        : Math.random() < 0.75
        ? -20 - Math.random() * 80
        : Math.random() * height;

      let sx: number;
      if (tier === "river_core") {
        const rc = getRiverCenter(sy, 0, currentProg);
        sx = rc + (Math.random() - 0.5) * (width * 0.14);
      } else if (tier === "river_halo") {
        const rc = getRiverCenter(sy, 0, currentProg);
        sx = rc + (Math.random() - 0.5) * (width * 0.32);
      } else {
        sx = Math.random() * width;
      }

      return {
        x: sx,
        y: sy,
        history: [{ x: sx, y: sy }],
        maxHistory: maxHist,
        speed: speedVal,
        width: widthVal,
        tier,
        sparkPhase: Math.random(),
        sparkSpeed: 0.012 + Math.random() * 0.018,
        hasSpark,
        alpha: alphaVal,
        accentType: accent,
      };
    };

    for (let i = 0; i < STREAMLINE_COUNT; i++) {
      streamlines.push(spawnStreamline(i, true, 0));
    }

    // --- CURL NOISE VECTOR FIELD WITH SECTION TRANSITIONS ---
    const getVector = (
      px: number,
      py: number,
      timeZ: number,
      mx: number,
      my: number,
      mActive: boolean,
      scrollProg: number
    ) => {
      // Dynamic frequency modulation per section
      // In AI Quiz: higher frequency turbulence (synaptic branching)
      // In Clubs: broader undulating arena waves
      const s1 = 0.00085 + 0.00025 * Math.sin(scrollProg * Math.PI);
      const s2 = 0.0022 + 0.0008 * (scrollProg > 0.4 && scrollProg < 0.65 ? 1.0 : 0.0);
      const delta = 1.0;

      // Section-modulated potential field
      const pYPlus =
        simplex.noise(px * s1, (py + delta) * s1, timeZ) * 1.0 +
        simplex.noise(px * s2, (py + delta) * s2, timeZ * 1.4) * 0.5 +
        Math.sin((py + delta) * 0.0028 + timeZ * 0.6 + scrollProg * 3.0) * 0.14;

      const pYMinus =
        simplex.noise(px * s1, (py - delta) * s1, timeZ) * 1.0 +
        simplex.noise(px * s2, (py - delta) * s2, timeZ * 1.4) * 0.5 +
        Math.sin((py - delta) * 0.0028 + timeZ * 0.6 + scrollProg * 3.0) * 0.14;

      const pXPlus =
        simplex.noise((px + delta) * s1, py * s1, timeZ) * 1.0 +
        simplex.noise((px + delta) * s2, py * s2, timeZ * 1.4) * 0.5;

      const pXMinus =
        simplex.noise((px - delta) * s1, py * s1, timeZ) * 1.0 +
        simplex.noise((px - delta) * s2, py * s2, timeZ * 1.4) * 0.5;

      // Incompressible curl
      let vx = ((pYPlus - pYMinus) / (2 * delta)) * 280.0;
      let vy = -((pXPlus - pXMinus) / (2 * delta)) * 280.0;

      // Section-aware momentum drift
      // In Sports: diagonal downward-right
      // In Clubs: broader S-curve wave
      // In Booking: focal convergence towards center
      if (scrollProg > 0.85) {
        // Final booking terminal: streamlines gently converge toward center
        const centerX = width * 0.5;
        const dirX = (centerX - px) / width;
        vx += dirX * 1.2;
        vy += 1.5;
      } else if (scrollProg > 0.2 && scrollProg < 0.42) {
        // Clubs section: stadium waves
        vx += 0.6 + 0.8 * Math.sin(py * 0.004 + timeZ);
        vy += 1.5;
      } else {
        vx += 0.85;
        vy += 1.6;
      }

      // Interactive Mouse Fluid Vortex
      if (mActive) {
        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        const radius = 290;
        const radiusSq = radius * radius;

        if (distSq < radiusSq && distSq > 4) {
          const dist = Math.sqrt(distSq);
          const factor = Math.pow(1 - dist / radius, 1.8);
          const normX = dx / dist;
          const normY = dy / dist;

          // Radial push + tangential swirl
          vx += normX * factor * 5.6;
          vy += normY * factor * 5.6;
          vx += -normY * factor * 7.2;
          vy += normX * factor * 7.2;
        }
      }

      const len = Math.sqrt(vx * vx + vy * vy);
      if (len > 0.0001) {
        vx /= len;
        vy /= len;
      }

      return { vx, vy };
    };

    let frame = 0;
    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      frame++;

      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Continuous scroll progress across all sections below Hero
      const heroHeight = window.innerHeight * 0.9;
      const scrollMax = Math.max(docHeight - window.innerHeight, 1);
      const scrollProg = Math.min(Math.max((scrollY - heroHeight) / (scrollMax - heroHeight), 0), 1);

      const timeZ = frame * 0.0022 + scrollY * 0.00035;

      // Volumetric Phosphor Aura (Soft bloom along the continuous river)
      if (isDark) {
        const riverX = getRiverCenter(height * 0.5, timeZ, scrollProg);
        const glowGrad = ctx.createRadialGradient(
          riverX,
          height * 0.5,
          50,
          riverX,
          height * 0.5,
          width * 0.65
        );
        glowGrad.addColorStop(0, "rgba(212, 255, 0, 0.065)");
        glowGrad.addColorStop(0.35, "rgba(163, 230, 53, 0.028)");
        glowGrad.addColorStop(0.7, scrollProg > 0.4 && scrollProg < 0.65 ? "rgba(0, 240, 255, 0.025)" : "rgba(34, 197, 94, 0.015)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Tier rendering order: Ambient -> Flank -> River Halo -> River Core
      const tiers: ("ambient" | "flank" | "river_halo" | "river_core")[] = [
        "ambient",
        "flank",
        "river_halo",
        "river_core",
      ];

      for (const tier of tiers) {
        for (let i = 0; i < streamlines.length; i++) {
          const s = streamlines[i];
          if (s.tier !== tier) continue;

          const { vx, vy } = getVector(
            s.x,
            s.y,
            timeZ,
            mouse.x,
            mouse.y,
            mouse.active,
            scrollProg
          );

          const stepDist = s.speed * dt * 60;
          s.x += vx * stepDist;
          s.y += vy * stepDist;

          s.history.push({ x: s.x, y: s.y });
          if (s.history.length > s.maxHistory) {
            s.history.shift();
          }

          const margin = 100;
          if (
            s.x < -margin ||
            s.x > width + margin ||
            s.y > height + margin ||
            s.history.length < 2
          ) {
            streamlines[i] = spawnStreamline(i, false, scrollProg);
            continue;
          }

          const pts = s.history;
          if (pts.length < 3) continue;

          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);

          for (let p = 1; p < pts.length - 1; p++) {
            const midX = (pts[p].x + pts[p + 1].x) / 2;
            const midY = (pts[p].y + pts[p + 1].y) / 2;
            ctx.quadraticCurveTo(pts[p].x, pts[p].y, midX, midY);
          }
          ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);

          ctx.lineWidth = s.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (isDark) {
            // DEEP EMERALD, GRAPHITE-GREEN & MUTED CYAN/TEAL (Low Brightness, High Text Contrast)
            if (s.tier === "river_core") {
              // Deep athletic emerald core
              ctx.strokeStyle = `rgba(16, 150, 90, ${s.alpha * 0.42})`;
              ctx.shadowColor = "rgba(16, 185, 129, 0.3)";
              ctx.shadowBlur = 8;
            } else if (s.tier === "river_halo") {
              // Deep forest / dark graphite-green halo
              ctx.strokeStyle = `rgba(14, 115, 72, ${s.alpha * 0.34})`;
              ctx.shadowColor = "rgba(16, 140, 80, 0.18)";
              ctx.shadowBlur = 5;
            } else if (s.tier === "flank") {
              if (s.accentType === "cyan") {
                // Muted neon-cyan / deep teal
                ctx.strokeStyle = `rgba(12, 140, 160, ${s.alpha * 0.36})`;
                ctx.shadowColor = "rgba(6, 182, 212, 0.22)";
                ctx.shadowBlur = 5;
              } else if (s.accentType === "emerald") {
                // Pure dark emerald
                ctx.strokeStyle = `rgba(18, 128, 80, ${s.alpha * 0.32})`;
                ctx.shadowColor = "rgba(16, 185, 129, 0.18)";
                ctx.shadowBlur = 4;
              } else {
                // Graphite moss
                ctx.strokeStyle = `rgba(28, 80, 58, ${s.alpha * 0.28})`;
                ctx.shadowBlur = 0;
              }
            } else {
              // Ambient deep slate-moss
              ctx.strokeStyle = `rgba(22, 65, 48, ${s.alpha * 0.24})`;
              ctx.shadowBlur = 0;
            }
          } else {
            // LIGHT THEME (Soft Muted Slate & Pine)
            if (s.tier === "river_core") {
              ctx.strokeStyle = `rgba(21, 100, 60, ${s.alpha * 0.45})`;
              ctx.shadowColor = "rgba(34, 197, 94, 0.25)";
              ctx.shadowBlur = 6;
            } else if (s.tier === "river_halo") {
              ctx.strokeStyle = `rgba(30, 65, 55, ${s.alpha * 0.35})`;
              ctx.shadowBlur = 0;
            } else if (s.tier === "flank") {
              ctx.strokeStyle = `rgba(15, 95, 90, ${s.alpha * 0.30})`;
              ctx.shadowBlur = 0;
            } else {
              ctx.strokeStyle = `rgba(71, 85, 105, ${s.alpha * 0.20})`;
              ctx.shadowBlur = 0;
            }
          }

          ctx.stroke();
          ctx.shadowBlur = 0;

          // Traveling Spark Nodes (Bio-electric kinetic pulses)
          if (s.hasSpark && pts.length > 8) {
            s.sparkPhase += s.sparkSpeed;
            if (s.sparkPhase > 1) s.sparkPhase = 0;

            const targetIdx = Math.floor(s.sparkPhase * (pts.length - 1));
            const sparkPt = pts[targetIdx];

            if (sparkPt) {
              const sparkRadius = s.tier === "river_core" ? 2.2 : 1.5;
              ctx.beginPath();
              ctx.arc(sparkPt.x, sparkPt.y, sparkRadius, 0, Math.PI * 2);

              if (isDark) {
                if (s.accentType === "cyan") {
                  ctx.fillStyle = "rgba(103, 232, 249, 0.85)";
                  ctx.shadowColor = "#06b6d4";
                } else {
                  ctx.fillStyle = "rgba(110, 231, 183, 0.85)";
                  ctx.shadowColor = "#10b981";
                }
                ctx.shadowBlur = 8;
              } else {
                ctx.fillStyle = "rgba(22, 101, 52, 0.8)";
                ctx.shadowColor = "#16a34a";
                ctx.shadowBlur = 5;
              }

              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none z-0 transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Dynamic Background Base: Slate-50 in light mode, deep #07080a in dark mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#07080a] transition-colors duration-500 -z-10" />

      {/* Fullscreen Continuous Flow Field Canvas:
          Remains fixed in the viewport as user scrolls through ALL sections below Hero.
          Provides seamless continuity, section-aware pattern morphing, and silky 60 FPS */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subtle athletic dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] dark:bg-[radial-gradient(#d4ff00_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035] pointer-events-none" />
    </div>
  );
}
