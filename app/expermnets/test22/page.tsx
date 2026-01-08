"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Types ---
interface Point3D {
  x: number;
  y: number;
  z: number;
  px: number; // Projected X
  py: number; // Projected Y
}

const config = {
  gridSize: 35, // Size of the mesh
  spacing: 45,  // Space between nodes
  noiseScale: 0.15,
  elevation: 120,
  perspective: 600,
  speed: 0.0004,
  pulseCount: 12,
};

export default function HyperTopology() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const noise2D = createNoise2D();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let pulses: { x: number; y: number; progress: number; speed: number; trail: Point3D[] }[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) / 10;
      mouseRef.current.targetY = (e.clientY - height / 2) / 10;
    };

    const project = (x: number, y: number, z: number, rotationX: number, rotationY: number) => {
      // Rotation
      const nx = x * Math.cos(rotationY) - z * Math.sin(rotationY);
      let nz = x * Math.sin(rotationY) + z * Math.cos(rotationY);
      const ny = y * Math.cos(rotationX) - nz * Math.sin(rotationX);
      nz = y * Math.sin(rotationX) + nz * Math.cos(rotationX);

      // Move camera back
      nz += 800;

      const factor = config.perspective / nz;
      return {
        x: width / 2 + nx * factor,
        y: height / 2 + ny * factor,
        scale: factor,
        z: nz
      };
    };

    const initPulses = () => {
      pulses = Array.from({ length: config.pulseCount }, () => ({
        x: Math.floor(Math.random() * config.gridSize),
        y: Math.floor(Math.random() * config.gridSize),
        progress: 0,
        speed: 0.02 + Math.random() * 0.05,
        trail: []
      }));
    };

    const animate = (time: number) => {
      ctx.fillStyle = "#010103";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse rotation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const rotX = -0.6 + mouseRef.current.y * 0.005;
      const rotY = mouseRef.current.x * 0.005;
      const t = time * config.speed;

      const points: Point3D[][] = [];

      // Generate Mesh
      for (let i = 0; i < config.gridSize; i++) {
        points[i] = [];
        for (let j = 0; j < config.gridSize; j++) {
          const x = (i - config.gridSize / 2) * config.spacing;
          const y = (j - config.gridSize / 2) * config.spacing;
          
          // Elevation based on noise
          let z = noise2D(i * config.noiseScale, j * config.noiseScale + t) * config.elevation;
          
          // Mouse distortion (dent)
          const dx = x - (mouseRef.current.x * 20);
          const dy = y - (mouseRef.current.y * 20);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            z -= (300 - dist) * 0.5;
          }

          const proj = project(x, z, y, rotX, rotY);
          points[i][j] = { x, y, z, px: proj.x, py: proj.y };
        }
      }

      // Draw horizontal lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < config.gridSize; i++) {
        for (let j = 0; j < config.gridSize - 1; j++) {
          const p1 = points[i][j];
          const p2 = points[i][j + 1];
          const opacity = Math.max(0, 0.3 - (p1.z + config.elevation) / 400);
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // Draw vertical lines
      for (let i = 0; i < config.gridSize - 1; i++) {
        for (let j = 0; j < config.gridSize; j++) {
          const p1 = points[i][j];
          const p2 = points[i + 1][j];
          const opacity = Math.max(0, 0.3 - (p1.z + config.elevation) / 400);
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // Update and Draw Data Pulses
      pulses.forEach(pulse => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          const dir = Math.random() > 0.5;
          if (dir) pulse.x = (pulse.x + 1) % config.gridSize;
          else pulse.y = (pulse.y + 1) % config.gridSize;
        }

        const nextX = (pulse.x + 1) % config.gridSize;
        const pCurrent = points[pulse.x][pulse.y];
        const pNext = points[nextX][pulse.y];

        const lx = pCurrent.px + (pNext.px - pCurrent.px) * pulse.progress;
        const ly = pCurrent.py + (pNext.py - pCurrent.py) * pulse.progress;

        // Draw pulse head
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#64ffda";
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    resize();
    initPulses();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseRef, noise2D]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#010103]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* HUD Elements */}
      <div className="absolute top-10 left-10 font-mono text-[10px] text-[#64ffda]/30 uppercase tracking-[0.5em] pointer-events-none">
        <div className="mb-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
          System Active: HyperTopology_v0.9
        </div>
        <div className="flex flex-col gap-1">
          <div>Coord: [{(mouseRef.current.x).toFixed(2)}, {(mouseRef.current.y).toFixed(2)}]</div>
          <div>Depth: 800m</div>
          <div>Field: Simplex_Vector</div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 font-mono text-[10px] text-[#64ffda]/30 uppercase tracking-[0.5em] pointer-events-none text-right">
        <div>Scanning Dimensional Fracture...</div>
        <div className="mt-2 w-32 h-[1px] bg-[#64ffda]/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#64ffda]/50 animate-progress-scan" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-scan {
          0% { width: 0%; left: -100%; }
          100% { width: 100%; left: 100%; }
        }
        .animate-progress-scan {
          animation: progress-scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
