"use client";
import { useEffect, useRef } from "react";

// --- Interface for each particle in our 3D hologram ---
interface Particle {
  x: number;
  y: number;
  z: number; // Current 3D position
  homeX: number;
  homeY: number;
  homeZ: number; // Its original position on the sphere
  vx: number;
  vy: number;
  vz: number;
}

export default function HolographicDisintegrationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const particlesRef = useRef<Particle[]>([]);
  const scanLineRef = useRef({ y: 0 });
  const rebootStateRef = useRef({ isActive: false, progress: 0 });

  // --- Configuration ---
  const config = {
    particleCount: 3000,
    sphereRadius: 250,
    fov: 400, // Field of view for 3D projection
    scanEffectHeight: 100, // The "thickness" of the disintegration effect
    disintegrationForce: 0.5,
    returnForce: 0.005,
    damping: 0.94,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Initialization and Resizing ---
    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = [];

      // Fibonacci sphere algorithm for even distribution
      const samples = config.particleCount;
      const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden angle in radians

      for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const r = config.sphereRadius * (1 + (Math.random() - 0.5) * 0.1); // Add some noise

        particlesRef.current.push({
          x: x * r,
          y: y * r,
          z: z * r,
          homeX: x * r,
          homeY: y * r,
          homeZ: z * r,
          vx: 0,
          vy: 0,
          vz: 0,
        });
      }
      rebootStateRef.current = { isActive: true, progress: 0 };
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      scanLineRef.current.y = e.clientY;
    };
    const handleClick = () => {
      if (!rebootStateRef.current.isActive) initialize();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      ctx.fillStyle = "rgba(8, 5, 12, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Handle Reboot animation
      if (rebootStateRef.current.isActive) {
        rebootStateRef.current.progress += 0.02;
        if (rebootStateRef.current.progress >= 1) {
          rebootStateRef.current.isActive = false;
          rebootStateRef.current.progress = 1;
        }
      }
      const rebootFactor = rebootStateRef.current.progress;

      particlesRef.current.forEach((p) => {
        // --- 1. Physics Calculation ---
        const scale = config.fov / (config.fov + p.z);
        const projY = centerY + p.y * scale;

        // Force from scan line
        const distToScanline = Math.abs(projY - scanLineRef.current.y);
        if (distToScanline < config.scanEffectHeight) {
          const force = (1 - distToScanline / config.scanEffectHeight) * config.disintegrationForce;
          p.vx += (Math.random() - 0.5) * force;
          p.vy += (Math.random() - 0.5) * force;
          p.vz += force * 2; // Push away from the screen
        }

        // Spring force to return home
        p.vx += (p.homeX * rebootFactor - p.x) * config.returnForce;
        p.vy += (p.homeY * rebootFactor - p.y) * config.returnForce;
        p.vz += (p.homeZ * rebootFactor - p.z) * config.returnForce;

        // Apply damping and update position
        p.vx *= config.damping;
        p.vy *= config.damping;
        p.vz *= config.damping;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // --- 2. 3D Projection and Drawing ---
        const finalScale = config.fov / (config.fov + p.z);
        if (finalScale > 0) {
          // Only draw if in front of the camera
          const projX = centerX + p.x * finalScale;
          const projSize = finalScale * 2;

          const dxHome = p.x - p.homeX * rebootFactor;
          const dyHome = p.y - p.homeY * rebootFactor;
          const dzHome = p.z - p.homeZ * rebootFactor;
          const stress = Math.min(1, Math.sqrt(dxHome * dxHome + dyHome * dyHome + dzHome * dzHome) / 100);

          const hue = 220; // Blue
          const saturation = 100 - stress * 100; // Desaturates to white
          const lightness = 60 + stress * 40; // Becomes brighter

          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${finalScale * 0.8})`;
          ctx.beginPath();
          ctx.arc(projX, centerY + p.y * finalScale, projSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw the scan line
      ctx.fillStyle = "rgba(180, 220, 255, 0.05)";
      ctx.fillRect(0, scanLineRef.current.y - config.scanEffectHeight, canvas.width, config.scanEffectHeight * 2);
      ctx.fillStyle = "rgba(180, 220, 255, 0.5)";
      ctx.fillRect(0, scanLineRef.current.y - 1, canvas.width, 2);

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", initialize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: "rgb(8, 5, 12)",
        cursor: "none",
      }}
    />
  );
}
