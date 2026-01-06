"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Trail {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  offset: number;
  speed: number;
}

const config = {
  trailCount: 40,
  pointsPerTrail: 80,
  baseHue: 220,
  spread: 0.002,
  friction: 0.95,
  spring: 0.1,
};

export default function DigitalSilk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<Trail[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const noise2D = createNoise2D();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current.tx = canvas.width / 2;
      mouseRef.current.ty = canvas.height / 2;
      initTrails();
    };

    const initTrails = () => {
      const trails: Trail[] = [];
      for (let i = 0; i < config.trailCount; i++) {
        const points = [];
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        for (let j = 0; j < config.pointsPerTrail; j++) {
          points.push({ x: startX, y: startY });
        }
        
        const hue = (config.baseHue + Math.random() * 60 - 30) % 360;
        trails.push({
          points,
          color: `hsla(${hue}, 80%, 60%, 0.15)`,
          width: Math.random() * 2 + 1,
          offset: Math.random() * 100,
          speed: Math.random() * 0.02 + 0.005,
        });
      }
      trailsRef.current = trails;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const animate = (time: number) => {
      // Create a "ghosting" effect for silk trails
      ctx.fillStyle = "rgba(4, 4, 8, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.1;

      const t = time * 0.001;

      trailsRef.current.forEach((trail, i) => {
        const head = trail.points[0];
        
        // Influence of noise and mouse
        const noiseValue = noise2D(head.x * config.spread, head.y * config.spread + t * 0.5 + trail.offset);
        const angle = noiseValue * Math.PI * 4;
        
        // Head follows mouse with some noise-based deviation
        head.x += (mouseRef.current.x - head.x) * (trail.speed * 2) + Math.cos(angle) * 5;
        head.y += (mouseRef.current.y - head.y) * (trail.speed * 2) + Math.sin(angle) * 5;

        // Draw the trail
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.strokeStyle = trail.color;
        ctx.lineWidth = trail.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let j = 1; j < trail.points.length; j++) {
          const p = trail.points[j];
          const prev = trail.points[j - 1];
          
          // Physics: each point follows the previous one with a spring effect
          p.x += (prev.x - p.x) * 0.4;
          p.y += (prev.y - p.y) * 0.4;

          // Draw bezier curves for smoothness
          const xc = (p.x + prev.x) / 2;
          const yc = (p.y + prev.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
        }
        ctx.stroke();

        // Add a subtle glow to the head of each silk strand
        ctx.shadowBlur = 15;
        ctx.shadowColor = trail.color;
        ctx.fillStyle = trail.color;
        ctx.beginPath();
        ctx.arc(head.x, head.y, trail.width * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Occasional "light flash" across the fabric
      if (Math.random() > 0.98) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020205]">
      <canvas
        ref={canvasRef}
        className="block mix-blend-screen"
      />
      
      {/* Abstract background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[100vw] h-[100vw] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[100vw] h-[100vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
