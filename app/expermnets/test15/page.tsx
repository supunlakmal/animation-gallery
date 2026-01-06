"use client";
import { useEffect, useRef } from "react";

// --- Interface for each energy core in our simulation ---
interface Core {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function EctoplasmicLensBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const coresRef = useRef<Core[]>([]);
  const mouseCoreRef = useRef<Core>({ x: 0, y: 0, vx: 0, vy: 0, radius: -80 }); // Negative radius for repulsion
  const inversionStateRef = useRef({ isActive: false, timer: 0 });

  // --- Configuration ---
  const config = {
    coreCount: 6,
    resolution: 0.25, // Simulate at 25% resolution for performance, then scale up
    inversionDuration: 60, // frames
    hue: 160, // A turquoise/ectoplasmic green
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

      coresRef.current = [];
      for (let i = 0; i < config.coreCount; i++) {
        coresRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          radius: Math.random() * 60 + 40,
        });
      }
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseCoreRef.current.x = e.clientX;
      mouseCoreRef.current.y = e.clientY;
    };

    const handleClick = () => {
      if (!inversionStateRef.current.isActive) {
        inversionStateRef.current.isActive = true;
        inversionStateRef.current.timer = config.inversionDuration;
        mouseCoreRef.current.radius = 120; // Become a strong attractor
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      const simWidth = Math.floor(canvas.width * config.resolution);
      const simHeight = Math.floor(canvas.height * config.resolution);

      // --- 1. Update Core Positions ---
      const allCores = [...coresRef.current, mouseCoreRef.current];
      coresRef.current.forEach((core) => {
        core.x += core.vx;
        core.y += core.vy;
        if (core.x < 0 || core.x > canvas.width) core.vx *= -1;
        if (core.y < 0 || core.y > canvas.height) core.vy *= -1;
      });

      // --- 2. Handle Phase Inversion state ---
      if (inversionStateRef.current.isActive) {
        inversionStateRef.current.timer--;
        if (inversionStateRef.current.timer <= 0) {
          inversionStateRef.current.isActive = false;
          mouseCoreRef.current.radius = -80; // Revert to repulsor
        }
      }

      // --- 3. Metaballs Calculation (on pixel data) ---
      const imageData = ctx.getImageData(0, 0, simWidth, simHeight);
      const data = imageData.data;

      for (let y = 0; y < simHeight; y++) {
        for (let x = 0; x < simWidth; x++) {
          const canvasX = x / config.resolution;
          const canvasY = y / config.resolution;
          let sum = 0;

          allCores.forEach((core) => {
            const dx = canvasX - core.x;
            const dy = canvasY - core.y;
            const distSq = dx * dx + dy * dy;
            if (distSq === 0) return;
            sum += (core.radius * core.radius) / distSq;
          });

          const index = (y * simWidth + x) * 4;
          if (sum > 0.8) {
            const intensity = Math.min(1, (sum - 0.8) * 2);
            const hue = config.hue + (inversionStateRef.current.isActive ? 100 : 0);
            const lightness = 50 + intensity * 30;
            const saturation = 80 + intensity * 20;

            // Simple HSL to RGB conversion
            const s = saturation / 100;
            const l = lightness / 100;
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x2 = c * (1 - Math.abs(((hue / 60) % 2) - 1));
            const m = l - c / 2;
            let r = 0,
              g = 0,
              b = 0;
            if (hue < 60) {
              r = c;
              g = x2;
            } else if (hue < 120) {
              r = x2;
              g = c;
            } else if (hue < 180) {
              g = c;
              b = x2;
            } else if (hue < 240) {
              g = x2;
              b = c;
            } else if (hue < 300) {
              r = x2;
              b = c;
            } else {
              r = c;
              b = x2;
            }

            data[index] = (r + m) * 255;
            data[index + 1] = (g + m) * 255;
            data[index + 2] = (b + m) * 255;
            data[index + 3] = 255;
          } else {
            data[index + 3] = 0; // Transparent
          }
        }
      }

      // --- 4. Render the result ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Create a temporary canvas to draw the low-res data
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = simWidth;
      tempCanvas.height = simHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) tempCtx.putImageData(imageData, 0, 0);

      // Now draw the low-res canvas scaled up, which provides a nice smoothing effect
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

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
