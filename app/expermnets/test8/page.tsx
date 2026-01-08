"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interfaces for the hidden particle universe ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

export default function TemporalRiftBackground() {
  // Canvas for the simulation
  const visibleCanvasRef = useRef<HTMLCanvasElement>(null);

  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const riftStateRef = useRef({ writeX: 0, isPaused: false });

  // --- Configuration ---
  const config = {
    particleCount: 500, // For the hidden simulation
    noiseScale: 0.008,
    noiseStrength: 1.5,
    particleSpeed: 2,
    fadeRate: "rgba(0, 0, 0, 0.1)",
    palette: [200, 280, 330], // Electric Blues and Pinks
  };

  const noise2D = createNoise2D(Math.random);

  // Function to create/reset particles for the hidden canvas
  const resetParticle = (p?: Particle): Particle => {
    const particle = p || ({} as Particle);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * config.particleSpeed + 0.5;

    particle.x = window.innerWidth / 2;
    particle.y = window.innerHeight / 2;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.maxLife = Math.random() * 100 + 100;
    particle.life = particle.maxLife;
    particle.hue = config.palette[Math.floor(Math.random() * config.palette.length)];
    return particle;
  };

  useEffect(() => {
    const visibleCanvas = visibleCanvasRef.current;
    if (!visibleCanvas) return;
    const visibleCtx = visibleCanvas.getContext("2d", { willReadFrequently: true });
    if (!visibleCtx) return;

    // Set up the hidden canvas for our particle simulation
    const sourceCanvas = document.createElement("canvas");
    const sourceCtx = sourceCanvas.getContext("2d");
    if (!sourceCtx) return;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      visibleCanvas.width = w;
      visibleCanvas.height = h;
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      particlesRef.current = Array.from({ length: config.particleCount }, () => resetParticle());
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleClick = () => {
      riftStateRef.current.isPaused = !riftStateRef.current.isPaused;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      // --- PART 1: Run the hidden particle simulation (if not paused) ---
      if (!riftStateRef.current.isPaused) {
        sourceCtx.fillStyle = config.fadeRate;
        sourceCtx.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);

        particlesRef.current.forEach((p) => {
          const noiseAngle = noise2D(p.x * config.noiseScale, p.y * config.noiseScale) * Math.PI * 2;
          p.vx += Math.cos(noiseAngle) * config.noiseStrength * 0.1;
          p.vy += Math.sin(noiseAngle) * config.noiseStrength * 0.1;
          p.vx = Math.max(-config.particleSpeed, Math.min(config.particleSpeed, p.vx));
          p.vy = Math.max(-config.particleSpeed, Math.min(config.particleSpeed, p.vy));

          p.x += p.vx;
          p.y += p.vy;
          p.life--;

          if (p.life <= 0 || p.x < 0 || p.x > sourceCanvas.width || p.y < 0 || p.y > sourceCanvas.height) {
            resetParticle(p);
          }

          const lifeRatio = p.life / p.maxLife;
          sourceCtx.fillStyle = `hsl(${p.hue}, 100%, ${60 + lifeRatio * 40}%)`;
          sourceCtx.beginPath();
          sourceCtx.arc(p.x, p.y, lifeRatio * 2 + 0.5, 0, Math.PI * 2);
          sourceCtx.fill();
        });
      }

      // --- PART 2: The Temporal Rift Effect ---
      const { writeX } = riftStateRef.current;
      const sampleX = Math.max(0, Math.min(sourceCanvas.width - 1, Math.floor(mouseRef.current.x)));

      // Grab a 1-pixel wide slice from the hidden canvas at the mouse's X position
      const pixelColumn = sourceCtx.getImageData(sampleX, 0, 1, sourceCanvas.height);

      // Draw that slice onto the visible canvas at the current write position
      visibleCtx.putImageData(pixelColumn, writeX, 0);

      // Draw a subtle cursor line on top to show where we are writing
      visibleCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
      visibleCtx.fillRect(writeX, 0, 1, sourceCanvas.height);

      // Advance the write position
      riftStateRef.current.writeX = (writeX + 1) % visibleCanvas.width;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={visibleCanvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: "rgb(5, 2, 8)",
        cursor: "crosshair",
      }}
    />
  );
}
