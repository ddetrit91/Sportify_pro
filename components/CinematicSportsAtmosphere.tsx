"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
}

interface Shape3D {
  vertices: Point3D[];
  edges: Edge[];
  x: number; // base X (percentage of width: 0..1)
  y: number; // base Y (percentage of height: 0..1)
  z: number; // depth offset
  size: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  floatPhase: number;
  floatSpeed: number;
  type: "icosahedron" | "gyro" | "octahedron";
}

export function CinematicSportsAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Theme state
    let isDark = document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Handle Resize & Retina support
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || window.innerHeight * 4;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse coordinates for parallax tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.targetX = normX;
      mouse.targetY = normY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll parallax tracking
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- 1. BUILD 3D GEOMETRIES ---
    // A. Icosahedron (12 vertices, 30 edges)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawIcoVerts: Point3D[] = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ];
    // Normalize vertices
    const icoVerts: Point3D[] = rawIcoVerts.map((v) => {
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    });
    const icoEdges: Edge[] = [];
    for (let i = 0; i < icoVerts.length; i++) {
      for (let j = i + 1; j < icoVerts.length; j++) {
        const dx = icoVerts[i].x - icoVerts[j].x;
        const dy = icoVerts[i].y - icoVerts[j].y;
        const dz = icoVerts[i].z - icoVerts[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // In normalized icosahedron, edge distance is ~1.051
        if (Math.abs(dist - 1.051) < 0.15) {
          icoEdges.push({ a: i, b: j });
        }
      }
    }

    // B. Octahedron (6 vertices, 12 edges)
    const octVerts: Point3D[] = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ];
    const octEdges: Edge[] = [
      { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
      { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 },
      { a: 2, b: 4 }, { a: 2, b: 5 }, { a: 3, b: 4 }, { a: 3, b: 5 },
    ];

    // C. Gyro Dual Rings (24 vertices, connecting edges)
    const gyroVerts: Point3D[] = [];
    const gyroEdges: Edge[] = [];
    const ringSegments = 14;
    // Ring 1 (XY plane)
    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      gyroVerts.push({ x: Math.cos(angle), y: Math.sin(angle), z: 0 });
      gyroEdges.push({ a: i, b: (i + 1) % ringSegments });
    }
    // Ring 2 (YZ plane, slightly larger)
    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      gyroVerts.push({ x: 0, y: Math.cos(angle) * 1.15, z: Math.sin(angle) * 1.15 });
      const currentIdx = ringSegments + i;
      const nextIdx = ringSegments + ((i + 1) % ringSegments);
      gyroEdges.push({ a: currentIdx, b: nextIdx });
    }
    // Connect subtle struts between the two perpendicular rings
    for (let i = 0; i < 4; i++) {
      gyroEdges.push({ a: (i * 3) % ringSegments, b: ringSegments + (i * 3) % ringSegments });
    }

    // --- 2. INSTANTIATE MOVING 3D FIGURES DISTRIBUTED ALONG PAGE HEIGHT ---
    const shapes: Shape3D[] = [
      // Top right (Bento section area)
      {
        vertices: icoVerts,
        edges: icoEdges,
        x: 0.88,
        y: 0.08,
        z: 320,
        size: 95,
        rx: 0.2,
        ry: 0.4,
        rz: 0.1,
        vrx: 0.006,
        vry: 0.009,
        vrz: 0.004,
        floatPhase: 0,
        floatSpeed: 0.015,
        type: "icosahedron",
      },
      // Mid-left (Featured Clubs area)
      {
        vertices: gyroVerts,
        edges: gyroEdges,
        x: 0.1,
        y: 0.28,
        z: 280,
        size: 110,
        rx: 0.5,
        ry: 0.2,
        rz: 0.3,
        vrx: 0.008,
        vry: 0.005,
        vrz: 0.007,
        floatPhase: 1.5,
        floatSpeed: 0.018,
        type: "gyro",
      },
      // Center-right (AI Quiz section area)
      {
        vertices: icoVerts,
        edges: icoEdges,
        x: 0.92,
        y: 0.52,
        z: 360,
        size: 130,
        rx: 0.1,
        ry: 0.8,
        rz: 0.4,
        vrx: 0.005,
        vry: 0.007,
        vrz: 0.006,
        floatPhase: 3.1,
        floatSpeed: 0.012,
        type: "icosahedron",
      },
      // Lower-left (Athlete Stories & Editorial area)
      {
        vertices: octVerts,
        edges: octEdges,
        x: 0.08,
        y: 0.74,
        z: 260,
        size: 90,
        rx: 0.4,
        ry: 0.1,
        rz: 0.5,
        vrx: 0.009,
        vry: 0.011,
        vrz: 0.005,
        floatPhase: 4.2,
        floatSpeed: 0.02,
        type: "octahedron",
      },
      // Bottom-right (Final Booking area)
      {
        vertices: gyroVerts,
        edges: gyroEdges,
        x: 0.86,
        y: 0.92,
        z: 300,
        size: 105,
        rx: 0.3,
        ry: 0.6,
        rz: 0.2,
        vrx: 0.007,
        vry: 0.008,
        vrz: 0.005,
        floatPhase: 2.2,
        floatSpeed: 0.016,
        type: "gyro",
      },
    ];

    // --- 3. KINETIC ENERGY PARTICLES (Volt & Cyan) ---
    const particleCount = 40;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      colorDark: string;
      colorLight: string;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        size: Math.random() * 2.2 + 1.2,
        colorDark: i % 2 === 0 ? "#d4ff00" : "#00f0ff",
        colorLight: i % 2 === 0 ? "#65a30d" : "#0284c7",
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // --- 4. 3D TOPOGRAPHICAL TERRAIN ELEVATION MESH ---
    const meshCols = 18;
    const meshRows = 12;
    let waveClock = 0;

    // --- 5. RENDER LOOP ---
    const fov = 450;

    const render = () => {
      waveClock += 0.014;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // A. Ambient Radial Mouse Glow (Reactive to theme)
      const mouseScreenX = (mouse.x * 0.5 + 0.5) * width;
      const mouseScreenY = scrollY + (mouse.y * 0.5 + 0.5) * window.innerHeight;

      const radial = ctx.createRadialGradient(
        mouseScreenX,
        mouseScreenY,
        40,
        mouseScreenX,
        mouseScreenY,
        Math.min(width, 900)
      );
      if (isDark) {
        radial.addColorStop(0, "rgba(212, 255, 0, 0.045)");
        radial.addColorStop(0.5, "rgba(0, 240, 255, 0.02)");
        radial.addColorStop(1, "rgba(6, 7, 9, 0)");
      } else {
        radial.addColorStop(0, "rgba(101, 163, 13, 0.04)");
        radial.addColorStop(0.5, "rgba(2, 132, 199, 0.015)");
        radial.addColorStop(1, "rgba(248, 250, 252, 0)");
      }
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // B. Render 3D Perspective Elevation Mesh (Upper & Lower waves)
      const drawElevationMesh = (baseYPercent: number, rowCount: number) => {
        const originX = width / 2 + mouse.x * 40;
        const originY = height * baseYPercent + mouse.y * 25;
        const meshPts: Array<Array<{ x: number; y: number; visible: boolean }>> = [];

        for (let r = 0; r < rowCount; r++) {
          meshPts[r] = [];
          const zDepth = 180 + r * 50;
          const scale = fov / zDepth;

          for (let c = 0; c < meshCols; c++) {
            const worldX = (c - meshCols / 2) * 110;
            const waveY =
              Math.sin(c * 0.4 + waveClock) * 30 +
              Math.cos(r * 0.5 + waveClock * 1.1) * 20 +
              Math.sin((c + r) * 0.25 + waveClock) * 15;

            const projX = originX + worldX * scale;
            const projY = originY + (waveY + r * 14) * scale;

            meshPts[r][c] = {
              x: projX,
              y: projY,
              visible: projX >= -100 && projX <= width + 100 && projY >= -100 && projY <= height + 100,
            };
          }
        }

        // Draw horizontal mesh lines
        for (let r = 0; r < rowCount; r++) {
          const rowProgress = r / rowCount;
          ctx.lineWidth = 1;
          if (isDark) {
            ctx.strokeStyle = `rgba(212, 255, 0, ${rowProgress * 0.12})`;
          } else {
            ctx.strokeStyle = `rgba(100, 116, 139, ${rowProgress * 0.15})`;
          }
          ctx.beginPath();
          let started = false;
          for (let c = 0; c < meshCols; c++) {
            const pt = meshPts[r][c];
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

        // Draw vertical mesh lines
        for (let c = 0; c < meshCols; c += 2) {
          if (isDark) {
            ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
          } else {
            ctx.strokeStyle = "rgba(2, 132, 199, 0.08)";
          }
          ctx.beginPath();
          let started = false;
          for (let r = 0; r < rowCount; r++) {
            const pt = meshPts[r][c];
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
      };

      // Draw elevation mesh near upper section (25%) and lower section (75%)
      drawElevationMesh(0.18, meshRows);
      drawElevationMesh(0.65, meshRows);

      // C. Render Kinetic Energy Particles & Dynamic Constellations
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        const px = p.x * width;
        const py = p.y * height;
        const color = isDark ? p.colorDark : p.colorLight;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        if (isDark) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles within 130px
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = px - p2.x * width;
          const dy = py - p2.y * height;
          const distSq = dx * dx + dy * dy;

          if (distSq < 16900) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 130) * (isDark ? 0.16 : 0.14);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.strokeStyle = color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // D. RENDER MOVING 3D FIGURES (POLYHEDRA & GYRO RINGS)
      shapes.forEach((shape) => {
        // Continuous rotation on 3 axes
        shape.rx += shape.vrx;
        shape.ry += shape.vry;
        shape.rz += shape.vrz;
        shape.floatPhase += shape.floatSpeed;

        // Floating offset calculation
        const floatOffsetY = Math.sin(shape.floatPhase) * 25;
        const floatOffsetX = Math.cos(shape.floatPhase * 0.8) * 15;

        // Mouse deflection on shape position
        const centerScreenX = shape.x * width + floatOffsetX + mouse.x * 25;
        const centerScreenY = shape.y * height + floatOffsetY + mouse.y * 20;

        // Precompute trigonometric matrices for 3D rotation
        const cx = Math.cos(shape.rx + mouse.y * 0.2);
        const sx = Math.sin(shape.rx + mouse.y * 0.2);
        const cy = Math.cos(shape.ry + mouse.x * 0.2);
        const sy = Math.sin(shape.ry + mouse.x * 0.2);
        const cz = Math.cos(shape.rz);
        const sz = Math.sin(shape.rz);

        // Project all vertices
        const projected = shape.vertices.map((v) => {
          // Scale base vertex by shape size
          const x0 = v.x * shape.size;
          const y0 = v.y * shape.size;
          const z0 = v.z * shape.size;

          // Rotate around X
          const y1 = y0 * cx - z0 * sx;
          const z1 = y0 * sx + z0 * cx;

          // Rotate around Y
          const x2 = x0 * cy + z1 * sy;
          const z2 = -x0 * sy + z1 * cy;

          // Rotate around Z
          const x3 = x2 * cz - y1 * sz;
          const y3 = x2 * sz + y1 * cz;
          const z3 = z2;

          // 3D perspective projection
          const totalDepth = Math.max(shape.z + z3, 100);
          const scale = fov / totalDepth;
          const projX = centerScreenX + x3 * scale;
          const projY = centerScreenY + y3 * scale;

          return { x: projX, y: projY, z: z3, scale };
        });

        // Determine shape color based on theme and type
        let edgeColor = isDark ? "rgba(212, 255, 0, 0.45)" : "rgba(101, 163, 13, 0.45)";
        let glowColor = isDark ? "#d4ff00" : "#65a30d";
        let nodeColor = isDark ? "#ffffff" : "#0f172a";

        if (shape.type === "gyro") {
          edgeColor = isDark ? "rgba(0, 240, 255, 0.4)" : "rgba(2, 132, 199, 0.45)";
          glowColor = isDark ? "#00f0ff" : "#0284c7";
          nodeColor = isDark ? "#00f0ff" : "#0284c7";
        } else if (shape.type === "octahedron") {
          edgeColor = isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(71, 85, 105, 0.45)";
          glowColor = isDark ? "#ffffff" : "#475569";
          nodeColor = isDark ? "#d4ff00" : "#65a30d";
        }

        // Draw 3D wireframe edges
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = edgeColor;
        if (isDark) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 6;
        }

        shape.edges.forEach((edge) => {
          const p1 = projected[edge.a];
          const p2 = projected[edge.b];
          if (!p1 || !p2) return;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
        ctx.shadowBlur = 0;

        // Draw vertex nodes
        projected.forEach((pt) => {
          const nodeRadius = Math.max(pt.scale * 1.8, 1.2);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor;
          if (isDark) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 5;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Dynamic Background Base: Slate-50 in light mode, deep #060709 in dark mode */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#060709] transition-colors duration-500" />

      {/* Canvas rendering moving 3D geometric figures, elevation mesh wave, and kinetic particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Transition Soft Gradient: Seamlessly dissolves from Hero Section into the 3D atmosphere */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#08090b] via-transparent to-transparent pointer-events-none z-10" />

      {/* Subtle athletic dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] dark:bg-[radial-gradient(#d4ff00_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.035] pointer-events-none" />
    </div>
  );
}