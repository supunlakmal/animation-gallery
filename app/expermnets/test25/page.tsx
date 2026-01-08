"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

// --- Configuration ---
const CONFIG = {
  gridSize: 35,
  lerpAmount: 0.1,
  mouseRadius: 400,
  noiseScale: 0.0015,
  noiseSpeed: 0.0004,
  particleCount: 50,
  bg: "#030014",
  colors: [
    "#4338ca", // Indigo
    "#7e22ce", // Purple
    "#2563eb", // Blue
    "#06b6d4", // Cyan
  ]
};

interface Point {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function AetherFlux() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const noise3D = createNoise3D();
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      const points: Point[] = [];
      const cols = Math.ceil(width / CONFIG.gridSize) + 1;
      const rows = Math.ceil(height / CONFIG.gridSize) + 1;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.push({
            baseX: x * CONFIG.gridSize,
            baseY: y * CONFIG.gridSize,
            x: x * CONFIG.gridSize,
            y: y * CONFIG.gridSize,
            vx: 0,
            vy: 0,
          });
        }
      }
      pointsRef.current = points;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const animate = (time: number) => {
      // Background
      ctx.fillStyle = CONFIG.bg;
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * CONFIG.lerpAmount;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * CONFIG.lerpAmount;

      const t = time * CONFIG.noiseSpeed;
      const points = pointsRef.current;
      const { x: mx, y: my } = mouseRef.current;

      // Update Points
      points.forEach(p => {
        // Noise influence
        const n = noise3D(p.baseX * CONFIG.noiseScale, p.baseY * CONFIG.noiseScale, t);
        const noiseAngle = n * Math.PI * 2;
        const noiseForce = 15;
        
        const tx = p.baseX + Math.cos(noiseAngle) * noiseForce;
        const ty = p.baseY + Math.sin(noiseAngle) * noiseForce;

        // Mouse influence
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let mForce = 0;
        if (dist < CONFIG.mouseRadius) {
          mForce = (1 - dist / CONFIG.mouseRadius) * 40;
          const mAngle = Math.atan2(dy, dx);
          p.x -= Math.cos(mAngle) * mForce * 0.2;
          p.y -= Math.sin(mAngle) * mForce * 0.2;
        }

        // Return to base
        p.x += (tx - p.x) * 0.05;
        p.y += (ty - p.y) * 0.05;
      });

      // Draw Connections (Mesh)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 0.5;

      const cols = Math.ceil(width / CONFIG.gridSize) + 1;
      const rows = Math.ceil(height / CONFIG.gridSize) + 1;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const p = points[i];
          
          if (!p) continue;

          // Connect right
          if (x < cols - 1) {
            const pr = points[i + 1];
            if (pr) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pr.x, pr.y);
            }
          }
          // Connect down
          if (y < rows - 1) {
            const pd = points[i + cols];
            if (pd) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pd.x, pd.y);
            }
          }
        }
      }
      ctx.stroke();

      // Draw Glowing Orbs at Mouse
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, CONFIG.mouseRadius);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
      gradient.addColorStop(1, "transparent");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Bloom points
      points.forEach((p, idx) => {
        if (idx % 4 !== 0) return; // Only draw some dots for performance
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const opacity = (1 - dist / 200);
          ctx.fillStyle = `rgba(165, 180, 252, ${opacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    init();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030014] flex items-center justify-center font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      


      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      <style jsx global>{`
        body {
          margin: 0;
          background: #030014;
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
}
