"use client";

import { useEffect, useRef } from "react";

// --- 3D SIMPLEX NOISE ENGINE ---
class SimplexNoise3D {
  private perm: Uint8Array;
  private permMod12: Uint8Array;

  constructor(seed = 19937) {
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
}

export function CinematicSportsAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const simplex = new SimplexNoise3D(9911);

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
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- HIGH DENSITY STREAMLINE FIELD (GENOMINES ARCHITECTURE) ---
    // 500 streamlines on desktop for dense, rich bioluminescent river
    const STREAMLINE_COUNT = width < 768 ? 240 : 520;
    const streamlines: Streamline[] = [];

    // Computes the central luminous river spine path (diagonal S-curve)
    const getRiverCenter = (py: number, timeZ: number) => {
      const normY = py / (height || 1);
      // Fluid meandering river across screen width
      const riverBaseX = width * 0.48;
      const meander =
        Math.sin(normY * 3.2 + timeZ * 0.8) * (width * 0.28) +
        Math.cos(normY * 1.5 - timeZ * 0.4) * (width * 0.14);
      return riverBaseX + meander;
    };

    const spawnStreamline = (index: number, initialScatter = false): Streamline => {
      const ratio = index / STREAMLINE_COUNT;
      let tier: "river_core" | "river_halo" | "flank" | "ambient";
      let widthVal: number;
      let maxHist: number;
      let speedVal: number;
      let alphaVal: number;
      const hasSpark = Math.random() < 0.24;

      if (ratio < 0.18) {
        // Tier 1: River Core (The brilliant glowing heart of the Genomines stream)
        tier = "river_core";
        widthVal = 2.4 + Math.random() * 2.2; // 2.4 - 4.6px
        maxHist = 45 + Math.floor(Math.random() * 25);
        speedVal = 2.6 + Math.random() * 1.8;
        alphaVal = 0.85 + Math.random() * 0.15;
      } else if (ratio < 0.42) {
        // Tier 2: River Halo & Concentrated Filaments
        tier = "river_halo";
        widthVal = 1.4 + Math.random() * 1.2; // 1.4 - 2.6px
        maxHist = 36 + Math.floor(Math.random() * 20);
        speedVal = 2.0 + Math.random() * 1.4;
        alphaVal = 0.55 + Math.random() * 0.25;
      } else if (ratio < 0.70) {
        // Tier 3: Flanking Speed Streaks (Cyan & Lime)
        tier = "flank";
        widthVal = 1.0 + Math.random() * 1.0;
        maxHist = 28 + Math.floor(Math.random() * 16);
        speedVal = 1.8 + Math.random() * 1.2;
        alphaVal = 0.35 + Math.random() * 0.2;
      } else {
        // Tier 4: Ambient Tapestry (Delicate background mycelial filaments)
        tier = "ambient";
        widthVal = 0.6 + Math.random() * 0.6;
        maxHist = 22 + Math.floor(Math.random() * 14);
        speedVal = 1.4 + Math.random() * 0.9;
        alphaVal = 0.14 + Math.random() * 0.12;
      }

      // Compute seed coordinates
      const sy = initialScatter ? Math.random() * height : -30 - Math.random() * 120;
      let sx: number;

      if (tier === "river_core") {
        const rc = getRiverCenter(sy, 0);
        sx = rc + (Math.random() - 0.5) * (width * 0.12);
      } else if (tier === "river_halo") {
        const rc = getRiverCenter(sy, 0);
        sx = rc + (Math.random() - 0.5) * (width * 0.28);
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
        sparkSpeed: 0.014 + Math.random() * 0.018,
        hasSpark,
        alpha: alphaVal,
      };
    };

    for (let i = 0; i < STREAMLINE_COUNT; i++) {
      streamlines.push(spawnStreamline(i, true));
    }

    // --- GENOMINES CURL NOISE VECTOR MATH ---
    // Evaluates divergence-free curl flow + magnetic mouse vortex
    const getVector = (
      px: number,
      py: number,
      timeZ: number,
      mx: number,
      my: number,
      mActive: boolean
    ) => {
      // Scale coordinates
      const s1 = 0.00085;
      const s2 = 0.0024;
      const delta = 1.0;

      // Genomines dual sine wave modulation & fBm noise potential
      const pYPlus =
        simplex.noise(px * s1, (py + delta) * s1, timeZ) * 1.0 +
        simplex.noise(px * s2, (py + delta) * s2, timeZ * 1.4) * 0.5 +
        Math.sin((py + delta) * 0.003 + timeZ * 0.6) * 0.12;

      const pYMinus =
        simplex.noise(px * s1, (py - delta) * s1, timeZ) * 1.0 +
        simplex.noise(px * s2, (py - delta) * s2, timeZ * 1.4) * 0.5 +
        Math.sin((py - delta) * 0.003 + timeZ * 0.6) * 0.12;

      const pXPlus =
        simplex.noise((px + delta) * s1, py * s1, timeZ) * 1.0 +
        simplex.noise((px + delta) * s2, py * s2, timeZ * 1.4) * 0.5;

      const pXMinus =
        simplex.noise((px - delta) * s1, py * s1, timeZ) * 1.0 +
        simplex.noise((px - delta) * s2, py * s2, timeZ * 1.4) * 0.5;

      // Incompressible Curl: Vx = dPsi/dy, Vy = -dPsi/dx
      let vx = (pYPlus - pYMinus) / (2 * delta) * 280.0;
      let vy = -(pXPlus - pXMinus) / (2 * delta) * 280.0;

      // Flow momentum: predominantly downward with diagonal athletic drift
      vx += 0.85;
      vy += 1.6;

      // Mouse interactive fluid vortex
      if (mActive) {
        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        const radius = 280;
        const radiusSq = radius * radius;

        if (distSq < radiusSq && distSq > 4) {
          const dist = Math.sqrt(distSq);
          const factor = Math.pow(1 - dist / radius, 1.8);
          const normX = dx / dist;
          const normY = dy / dist;

          // Radial repulsion (lines part around cursor)
          vx += normX * factor * 5.5;
          vy += normY * factor * 5.5;

          // Tangential swirl (fluid vortex)
          vx += -normY * factor * 7.0;
          vy += normX * factor * 7.0;
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

      const timeZ = frame * 0.0022 + scrollY * 0.0004;

      // Volumetric Bioluminescent Phosphor Bleed (Genomines signature aura)
      if (isDark) {
        const riverX = getRiverCenter(height * 0.5, timeZ);
        const glowGrad = ctx.createRadialGradient(
          riverX,
          height * 0.5,
          60,
          riverX,
          height * 0.5,
          width * 0.65
        );
        glowGrad.addColorStop(0, "rgba(212, 255, 0, 0.065)");
        glowGrad.addColorStop(0.35, "rgba(163, 230, 53, 0.03)");
        glowGrad.addColorStop(0.7, "rgba(0, 240, 255, 0.012)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Group rendering by tier
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
            mouse.active
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
            streamlines[i] = spawnStreamline(i, false);
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
            if (s.tier === "river_core") {
              // Genomines vibrant Neon Volt core with intense phosphor bloom
              ctx.strokeStyle = `rgba(225, 255, 60, ${s.alpha})`;
              ctx.shadowColor = "#d4ff00";
              ctx.shadowBlur = 20;
            } else if (s.tier === "river_halo") {
              ctx.strokeStyle = `rgba(180, 245, 40, ${s.alpha})`;
              ctx.shadowColor = "#a3e635";
              ctx.shadowBlur = 10;
            } else if (s.tier === "flank") {
              // Subtle cyan speed accents mixed into lime currents
              if (i % 3 === 0) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${s.alpha * 0.85})`;
                ctx.shadowColor = "#00f0ff";
                ctx.shadowBlur = 8;
              } else {
                ctx.strokeStyle = `rgba(163, 230, 53, ${s.alpha})`;
                ctx.shadowColor = "#a3e635";
                ctx.shadowBlur = 6;
              }
            } else {
              // Ambient delicate filaments
              ctx.strokeStyle = `rgba(212, 255, 0, ${s.alpha})`;
              ctx.shadowBlur = 0;
            }
          } else {
            // LIGHT THEME: High-contrast athletic slate/graphite with emerald & lime highlights
            if (s.tier === "river_core") {
              ctx.strokeStyle = `rgba(21, 128, 61, ${s.alpha * 0.9})`; // Racing Green
              ctx.shadowColor = "rgba(34, 197, 94, 0.4)";
              ctx.shadowBlur = 12;
            } else if (s.tier === "river_halo") {
              ctx.strokeStyle = `rgba(30, 41, 59, ${s.alpha * 0.7})`; // Deep slate
              ctx.shadowBlur = 0;
            } else if (s.tier === "flank") {
              ctx.strokeStyle = `rgba(51, 65, 85, ${s.alpha * 0.6})`;
              ctx.shadowBlur = 0;
            } else {
              ctx.strokeStyle = `rgba(100, 116, 139, ${s.alpha * 0.5})`; // Hairline slate
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
              const sparkRadius = s.tier === "river_core" ? 2.6 : 1.8;
              ctx.beginPath();
              ctx.arc(sparkPt.x, sparkPt.y, sparkRadius, 0, Math.PI * 2);

              if (isDark) {
                ctx.fillStyle = s.tier === "river_core" ? "#ffffff" : "#d4ff00";
                ctx.shadowColor = "#d4ff00";
                ctx.shadowBlur = 14;
              } else {
                ctx.fillStyle = "#16a34a";
                ctx.shadowColor = "#22c55e";
                ctx.shadowBlur = 8;
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
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Dynamic Background Base: Slate-50 in light mode, deep #07080a in dark mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#07080a] transition-colors duration-500" />

      {/* Sticky Fullscreen Flow Field Canvas:
          Sticks to the top of the viewport during scroll through all below-hero sections,
          guaranteeing silky-smooth 60 FPS viewport rendering and ZERO overlap with Hero Section */}
      <div className="sticky top-0 w-full h-screen pointer-events-none -mb-[100vh]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Top Transition Soft Gradient: Seamlessly dissolves from Hero Section into the Flow Field */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#08090b] dark:from-[#08090b] from-slate-200/50 via-transparent to-transparent pointer-events-none z-10" />

      {/* Subtle athletic dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] dark:bg-[radial-gradient(#d4ff00_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035] pointer-events-none" />
    </div>
  );
}
