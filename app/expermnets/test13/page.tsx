"use client";
import { useEffect, useRef } from "react";

// --- Interface for each ring in our engine ---
interface Ring {
  radius: number;
  lineCount: number;
  rotation: number;
  baseSpeed: number; // The inherent speed and direction
}

export default function MoireEngineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const ringsRef = useRef<Ring[]>([]);
  const engineStateRef = useRef({
    speedMultiplier: 0,
    lineDensity: 0.5, // 0 to 1
  });

  // --- Configuration ---
  const config = {
    ringCount: 12,
    maxRadius: 0.5, // Percentage of the smallest canvas dimension
    baseLineCount: 300,
    hue: 220, // A deep, electric blue
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
      ringsRef.current = [];
      const maxDim = Math.min(canvas.width, canvas.height) * config.maxRadius;

      for (let i = 0; i < config.ringCount; i++) {
        ringsRef.current.push({
          radius: maxDim * ((i + 1) / config.ringCount),
          lineCount: Math.floor(config.baseLineCount * ((i + 1) / config.ringCount) * 0.5),
          rotation: Math.random() * Math.PI * 2,
          // Alternate ring directions for more complex patterns
          baseSpeed: (i % 2 === 0 ? 1 : -1) * (0.001 + Math.random() * 0.001),
        });
      }
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      // X maps to speed (-1 to 1)
      const speed = (e.clientX / canvas.width) * 2 - 1;
      // Y maps to density (0.1 to 1.5)
      const density = (e.clientY / canvas.height) * 1.4 + 0.1;

      engineStateRef.current.speedMultiplier = speed;
      engineStateRef.current.lineDensity = density;
    };

    const handleClick = () => {
      // "Phase Shift" event
      ringsRef.current.forEach((ring) => {
        ring.rotation += (Math.random() - 0.5) * 0.5;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      ctx.fillStyle = "rgb(8, 5, 12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const { speedMultiplier, lineDensity } = engineStateRef.current;

      const energy = Math.abs(speedMultiplier); // 0 to 1
      const lightness = 60 + energy * 40;
      const lineWidth = 1 + energy * 1;
      ctx.strokeStyle = `hsl(${config.hue}, 100%, ${lightness}%)`;
      ctx.lineWidth = lineWidth;

      ringsRef.current.forEach((ring) => {
        // Update rotation based on base speed and user input
        ring.rotation += ring.baseSpeed * speedMultiplier;

        ctx.beginPath();
        const effectiveLineCount = Math.floor(ring.lineCount * lineDensity);

        for (let i = 0; i < effectiveLineCount; i++) {
          const angle = ring.rotation + (i / effectiveLineCount) * Math.PI * 2;
          const startRadius = ring.radius - 10;
          const endRadius = ring.radius + 10;

          const startX = centerX + Math.cos(angle) * startRadius;
          const startY = centerY + Math.sin(angle) * startRadius;
          const endX = centerX + Math.cos(angle) * endRadius;
          const endY = centerY + Math.sin(angle) * endRadius;

          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
        }
        ctx.stroke();
      });

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
