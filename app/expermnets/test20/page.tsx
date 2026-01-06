"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glow: string;
  originalSize: number;
  targetSize: number;
}

const config = {
  particleCount: 150,
  connectionDistance: 120,
  mouseRadius: 200,
  forceStrength: 0.5,
  friction: 0.96,
  colors: [
    { base: "#6366f1", glow: "rgba(99, 102, 241, 0.5)" }, // Indigo
    { base: "#a855f7", glow: "rgba(168, 85, 247, 0.5)" }, // Purple
    { base: "#ec4899", glow: "rgba(236, 72, 153, 0.5)" }, // Pink
    { base: "#06b6d4", glow: "rgba(6, 182, 212, 0.5)" }, // Cyan
  ],
};

export default function NebulaFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isAttractingRef = useRef(false);
  const noise2D = createNoise2D();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < config.particleCount; i++) {
        const colorSet = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: size,
          originalSize: size,
          targetSize: size,
          color: colorSet.base,
          glow: colorSet.glow,
        });
      }
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      isAttractingRef.current = true;
    };

    const handleMouseUp = () => {
      isAttractingRef.current = false;
    };

    const animate = (time: number) => {
      // Dark gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, "#08080c");
      gradient.addColorStop(1, "#010103");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const t = time * 0.001;

      // Update and draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Dynamic animation based on noise
        const n = noise2D(p1.x * 0.0015, p1.y * 0.0015 + t * 0.05);
        p1.vx += Math.cos(n * Math.PI * 2) * 0.04;
        p1.vy += Math.sin(n * Math.PI * 2) * 0.04;

        // Mouse interaction
        const dx = p1.x - mouseRef.current.x;
        const dy = p1.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.mouseRadius) {
          const forceMultiplier = isAttractingRef.current ? -5 : 1;
          const force = (1 - dist / config.mouseRadius) * config.forceStrength * forceMultiplier;
          p1.vx += (dx / dist) * force;
          p1.vy += (dy / dist) * force;
          p1.targetSize = isAttractingRef.current ? p1.originalSize * 0.5 : p1.originalSize * 3;
        } else {
          p1.targetSize = p1.originalSize;
        }

        // Apply friction and move
        p1.size += (p1.targetSize - p1.size) * 0.1;
        p1.vx *= config.friction;
        p1.vy *= config.friction;
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Boundary wrap
        if (p1.x < 0) p1.x = canvas.width;
        if (p1.x > canvas.width) p1.x = 0;
        if (p1.y < 0) p1.y = canvas.height;
        if (p1.y > canvas.height) p1.y = 0;

        // Draw connections (optimized loop)
        ctx.beginPath();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p1.x - p2.x;
          const cdy = p1.y - p2.y;
          const cdist = cdx * cdx + cdy * cdy; // Using squared distance for performance

          if (cdist < config.connectionDistance * config.connectionDistance) {
            const alpha = (1 - Math.sqrt(cdist) / config.connectionDistance) * 0.3;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
        ctx.stroke();
      }

      // Draw particles with glow
      particles.forEach(p => {
        ctx.shadowBlur = p.size * 5;
        ctx.shadowColor = p.glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw "Event Horizon" if attracting
      if (isAttractingRef.current) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "white";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block"
      />
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
