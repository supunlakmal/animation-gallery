"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interface for our new "Watercolor Blooms" ---
interface Bloom {
  x: number;
  y: number;
  vx: number; // Velocity x
  vy: number; // Velocity y
  life: number;
  maxLife: number;
  radius: number;
  maxRadius: number;
  color: { h: number; s: number; l: number };
}

export default function LivingWatercolorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const bloomsRef = useRef<Bloom[]>([]);

  // --- Configuration for the Living Watercolor theme ---
  const config = {
    bloomCount: 300,
    noiseScale: 0.0015, // A very large, slow-moving flow field
    noiseStrength: 0.04, // Gentle influence on the blooms
    fadeRate: "rgba(30, 30, 35, 0.05)", // Slow fade for a persistent painting
    palette: [
      // A vibrant, analogous color palette
      { h: 180, s: 100, l: 60 }, // Teal
      { h: 220, s: 100, l: 65 }, // Blue
      { h: 260, s: 100, l: 70 }, // Purple
    ],
    mouseSpawnRate: 3, // How many blooms to paint on mouse move
    clickSpawnCount: 25, // How many blooms to splotch on click
  };

  const noise2D = createNoise2D(Math.random);

  // Function to create or reset a bloom
  const resetBloom = (b?: Bloom, x?: number, y?: number): Bloom => {
    const bloom = b || ({} as Bloom);

    bloom.x = x ?? Math.random() * window.innerWidth;
    bloom.y = y ?? Math.random() * window.innerHeight;
    bloom.vx = 0;
    bloom.vy = 0;
    bloom.maxLife = Math.random() * 300 + 400; // Longer life for a lingering effect
    bloom.life = bloom.maxLife;
    bloom.maxRadius = Math.random() * 40 + 30;
    bloom.radius = 0;
    bloom.color = config.palette[Math.floor(Math.random() * config.palette.length)];

    return bloom;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    bloomsRef.current = Array.from({ length: config.bloomCount }, () => resetBloom());

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < config.mouseSpawnRate; i++) {
        const bIndex = Math.floor(Math.random() * config.bloomCount);
        resetBloom(bloomsRef.current[bIndex], e.clientX, e.clientY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < config.clickSpawnCount; i++) {
        const bIndex = Math.floor(Math.random() * config.bloomCount);
        resetBloom(bloomsRef.current[bIndex], e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      // 1. Fade the canvas slightly to make the painting evolve
      ctx.fillStyle = config.fadeRate;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Set the composite operation for beautiful color blending
      ctx.globalCompositeOperation = "lighter";

      // 3. Update and draw each bloom
      bloomsRef.current.forEach((b) => {
        // --- Physics & Life ---
        const noiseAngle = noise2D(b.x * config.noiseScale, b.y * config.noiseScale) * Math.PI * 2;
        b.vx += Math.cos(noiseAngle) * config.noiseStrength;
        b.vy += Math.sin(noiseAngle) * config.noiseStrength;

        // Damping
        b.vx *= 0.98;
        b.vy *= 0.98;

        b.x += b.vx;
        b.y += b.vy;
        b.life--;

        // Reset if life is over or it's off-screen
        if (b.life <= 0 || b.x < -b.maxRadius || b.x > canvas.width + b.maxRadius || b.y < -b.maxRadius || b.y > canvas.height + b.maxRadius) {
          resetBloom(b);
        }

        // --- Drawing ---
        const lifeRatio = b.life / b.maxLife;
        // The radius grows and then shrinks for a "blooming" effect
        b.radius = Math.sin(lifeRatio * Math.PI) * b.maxRadius;

        if (b.radius > 0) {
          // Create a radial gradient for a soft, feathered edge
          const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
          const colorString = `hsla(${b.color.h}, ${b.color.s}%, ${b.color.l}%, ${lifeRatio * 0.8})`;
          const transparentString = `hsla(${b.color.h}, ${b.color.s}%, ${b.color.l}%, 0)`;

          gradient.addColorStop(0, colorString);
          gradient.addColorStop(1, transparentString);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Reset composite operation to default for other potential draw calls
      ctx.globalCompositeOperation = "source-over";

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        // A dark paper-like background
        backgroundColor: "rgb(30, 30, 35)",
        cursor: "crosshair",
      }}
    />
  );
}
