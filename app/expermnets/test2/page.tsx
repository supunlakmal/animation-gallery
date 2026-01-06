"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interfaces for our new Celestial Objects ---
interface Particle {
  x: number;
  y: number;
  px: number; // Previous x
  py: number; // Previous y
  vx: number; // Velocity x
  vy: number; // Velocity y
  life: number;
  maxLife: number;
  scale: number; // For size and speed, creating depth
  hue: number; // To give each particle a unique color
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface GravityWell {
  x: number;
  y: number;
  strength: number;
  life: number;
}

export default function CelestialDustBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const gravityWellsRef = useRef<GravityWell[]>([]);

  // --- Configuration for the Celestial Dust theme ---
  const config = {
    particleCount: 600,
    noiseScale: 0.002, // More subtle, large-scale cosmic currents
    noiseStrength: 0.05, // Less influence from the noise field
    fadeRate: "rgba(10, 12, 20, 0.15)", // A deep space, semi-transparent fade
    celestialPalette: [200, 240, 300, 45], // Hues for blues, purples, and gold
    gravityStrength: 150, // How powerful the click interaction is
    mouseSpawnRate: 2, // Gentle spawn rate on mouse move
  };

  const noise2D = createNoise2D(Math.random);

  // Function to create or reset a particle
  const resetParticle = (p?: Particle, x?: number, y?: number): Particle => {
    const particle = p || ({} as Particle);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.5 + 0.2;

    particle.x = x ?? Math.random() * window.innerWidth;
    particle.y = y ?? Math.random() * window.innerHeight;
    particle.px = particle.x;
    particle.py = particle.y;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.maxLife = Math.random() * 200 + 300;
    particle.life = particle.maxLife;
    particle.scale = Math.random() * 0.5 + 0.25; // Vary size for depth
    particle.hue = config.celestialPalette[Math.floor(Math.random() * config.celestialPalette.length)];
    particle.twinkleSpeed = Math.random() * 0.05 + 0.01;
    particle.twinkleOffset = Math.random() * Math.PI * 2;

    return particle;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particlesRef.current = Array.from({ length: config.particleCount }, () => resetParticle());

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < config.mouseSpawnRate; i++) {
        const pIndex = Math.floor(Math.random() * config.particleCount);
        resetParticle(particlesRef.current[pIndex], e.clientX, e.clientY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create a new gravity well on click
      gravityWellsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        strength: config.gravityStrength,
        life: 120, // Lasts for 120 frames
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = (timestamp: number) => {
      // 1. Fade the canvas to create shimmering trails
      ctx.fillStyle = config.fadeRate;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Update and remove gravity wells
      gravityWellsRef.current = gravityWellsRef.current.filter((well) => {
        well.life--;
        return well.life > 0;
      });

      // 3. Update and draw each particle
      particlesRef.current.forEach((p) => {
        p.px = p.x;
        p.py = p.y;

        // --- Physics ---
        // a. Apply noise field for gentle, ambient movement
        const noiseAngle = noise2D(p.x * config.noiseScale, p.y * config.noiseScale) * Math.PI * 2;
        p.vx += Math.cos(noiseAngle) * config.noiseStrength * p.scale * 0.1;
        p.vy += Math.sin(noiseAngle) * config.noiseStrength * p.scale * 0.1;

        // b. Apply gravity wells
        gravityWellsRef.current.forEach((well) => {
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 1) {
            // Avoid division by zero
            const force = well.strength / distSq;
            p.vx += dx * force * p.scale;
            p.vy += dy * force * p.scale;
          }
        });

        // c. Update position and decrease life
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // d. Boundary wrapping
        if (p.x < 0) {
          p.x = p.px = canvas.width;
        }
        if (p.x > canvas.width) {
          p.x = p.px = 0;
        }
        if (p.y < 0) {
          p.y = p.py = canvas.height;
        }
        if (p.y > canvas.height) {
          p.y = p.py = 0;
        }
        if (p.life <= 0) {
          resetParticle(p);
        }

        // --- Drawing ---
        const lifeRatio = p.life / p.maxLife;
        // Pulsating twinkle effect
        const twinkle = 0.5 + Math.sin(timestamp * p.twinkleSpeed + p.twinkleOffset) * 0.5;
        const opacity = lifeRatio * 0.5 * twinkle + 0.2;
        const brightness = 70 + 30 * twinkle; // Pulsating brightness (70% to 100%)

        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${brightness}%, ${opacity})`;
        ctx.lineWidth = lifeRatio * p.scale * 2.5 + 0.1;

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

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
        // The starting background color for our deep space canvas
        backgroundColor: "rgb(10, 12, 20)",
      }}
    />
  );
}
