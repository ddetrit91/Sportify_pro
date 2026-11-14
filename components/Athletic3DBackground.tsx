"use client";

import { useEffect, useRef } from "react";

export function Athletic3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interactive coordinates
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // 1. Kinetic Athletic Particles (Volt & Cyan)
    const particleCount = Math.min(Math.floor(width / 22), 55);
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ["#d4ff00", "#00f0ff", "#ffffff"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // 2. 3D Athletic Terrain Wireframe Wave
    let waveTime = 0;
    const gridCols = 24;
    const gridRows = 16;
    const fov = 400;

    const render = () => {
      waveTime += 0.012;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep radial ambient glow following mouse subtly
      const radialGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        50,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.65
      );
      radialGlow.addColorStop(0, "rgba(212, 255, 0, 0.035)");
      radialGlow.addColorStop(0.5, "rgba(0, 240, 255, 0.015)");
      radialGlow.addColorStop(1, "rgba(8, 9, 11, 0)");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // --- Draw 3D Topographical Perspective Grid (Athletic Elevation Mesh) ---
      const meshPoints: Array<Array<{ x: number; y: number; visible: boolean }>> = [];
      const originX = width / 2 + (mouse.x - width / 2) * 0.08;
      const originY = height * 0.72 + (mouse.y - height / 2) * 0.06;

      for (let r = 0; r < gridRows; r++) {
        meshPoints[r] = [];
        const z = 150 + r * 55;
        const scale = fov / z;

        for (let c = 0; c < gridCols; c++) {
          const worldX = (c - gridCols / 2) * 95;
          // Kinetic 3D mountain wave calculation
          const waveHeight =
            Math.sin(c * 0.45 + waveTime) * 35 +
            Math.cos(r * 0.55 + waveTime * 1.2) * 25 +
            Math.sin((c + r) * 0.3 + waveTime) * 20;

          const projX = originX + worldX * scale;
          const projY = originY + (waveHeight + r * 15) * scale;

          meshPoints[r][c] = {
            x: projX,
            y: projY,
            visible: projX >= -100 && projX <= width + 100 && projY >= -100 && projY <= height + 100,
          };
        }
      }

      // Draw horizontal & vertical perspective wireframe
      ctx.lineWidth = 1;
      for (let r = 0; r < gridRows; r++) {
        const rowAlpha = (r / gridRows) * 0.16;
        ctx.strokeStyle = `rgba(212, 255, 0, ${rowAlpha})`;
        ctx.beginPath();
        let started = false;

        for (let c = 0; c < gridCols; c++) {
          const pt = meshPoints[r][c];
          if (!pt.visible) continue;
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      for (let c = 0; c < gridCols; c += 2) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
        ctx.beginPath();
        let started = false;

        for (let r = 0; r < gridRows; r++) {
          const pt = meshPoints[r][c];
          if (!pt.visible) continue;
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // --- Draw Kinetic Energy Particles & Constellation Interconnections ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = p.color === "#d4ff00" ? `rgba(212, 255, 0, ${lineAlpha})` : `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle diagonal speed lines texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4ff00_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035]" />
    </div>
  );
}