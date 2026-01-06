"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interface for our Grid Points (the underlying reality) ---
interface GridPoint {
  x: number;
  y: number;
  homeX: number; // Where it belongs
  homeY: number;
  vx: number; // Velocity for the singularity effect
  vy: number;
  char: string;
}

export default function AetherLensBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null); // For the pre-rendered grid
  const animationFrameRef = useRef<number | undefined>(undefined);
  const gridPointsRef = useRef<GridPoint[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, isDown: false });

  // --- Configuration ---
  const config = {
    gridSize: 20, // The spacing of the grid
    lensRadius: 150, // The size of our distortion lens
    distortionStrength: 100, // How much the lens displaces the grid
    chromaticAberration: 8, // How much the colors separate
    returnForce: 0.05, // How fast points return after singularity
    damping: 0.92, // Friction for the singularity effect
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    font: "12px 'Fira Code', monospace",
    baseColor: "rgba(100, 150, 200, 0.5)",
  };

  const noise2D = createNoise2D(Math.random);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Pre-render the static background grid ---
    const renderStaticBackground = (width: number, height: number) => {
      if (!staticCanvasRef.current) {
        staticCanvasRef.current = document.createElement("canvas");
      }
      const staticCanvas = staticCanvasRef.current;
      const staticCtx = staticCanvas.getContext("2d");
      if (!staticCtx) return;

      staticCanvas.width = width;
      staticCanvas.height = height;

      staticCtx.font = config.font;
      staticCtx.fillStyle = config.baseColor;
      staticCtx.textAlign = "center";
      staticCtx.textBaseline = "middle";

      gridPointsRef.current.forEach((p) => {
        staticCtx.fillText(p.char, p.homeX, p.homeY);
      });
    };

    const initializeGrid = (width: number, height: number) => {
      gridPointsRef.current = [];
      for (let y = 0; y < height; y += config.gridSize) {
        for (let x = 0; x < width; x += config.gridSize) {
          gridPointsRef.current.push({
            x: x,
            y: y,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            char: config.chars[Math.floor(Math.random() * config.chars.length)],
          });
        }
      }
      renderStaticBackground(width, height);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeGrid(canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { ...mouseRef.current, x: e.clientX, y: e.clientY };
    };
    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };
    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // --- Main Animation Loop ---
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw the pre-rendered static grid as the base layer
      if (staticCanvasRef.current) {
        ctx.drawImage(staticCanvasRef.current, 0, 0);
      }

      // --- Singularity Physics (only when mouse is down) ---
      gridPointsRef.current.forEach((p) => {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;

        if (mouseRef.current.isDown) {
          // Pull towards singularity
          p.vx -= (dx / (Math.abs(dx) + 10)) * 0.5;
          p.vy -= (dy / (Math.abs(dy) + 10)) * 0.5;
        } else {
          // Return home
          p.vx += (p.homeX - p.x) * config.returnForce;
          p.vy += (p.homeY - p.y) * config.returnForce;
        }

        p.vx *= config.damping;
        p.vy *= config.damping;
        p.x += p.vx;
        p.y += p.vy;
      });

      // --- Lens Rendering ---
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Get the bounding box of the lens effect area
      const lensLeft = mouseX - config.lensRadius;
      const lensTop = mouseY - config.lensRadius;
      const lensSize = config.lensRadius * 2;

      // Save the area behind the lens
      const lensImageData = ctx.getImageData(lensLeft, lensTop, lensSize, lensSize);
      ctx.clearRect(lensLeft, lensTop, lensSize, lensSize);

      ctx.font = config.font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      gridPointsRef.current.forEach((p) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.lensRadius) {
          // This point is inside the lens, so we draw its distorted version
          const angle = Math.atan2(dy, dx);
          const force = (config.lensRadius - dist) / config.lensRadius; // Stronger at center

          // Use noise for a fluid, shimmering displacement
          const noiseX = noise2D(p.x * 0.01 + timestamp * 0.0001, p.y * 0.01);
          const noiseY = noise2D(p.x * 0.01, p.y * 0.01 + timestamp * 0.0001);

          const displacement = force * config.distortionStrength;
          const displacedX = p.x + noiseX * displacement;
          const displacedY = p.y + noiseY * displacement;

          // Chromatic Aberration
          const caOffset = force * config.chromaticAberration;
          ctx.fillStyle = "rgba(255, 0, 100, 0.8)"; // Red channel
          ctx.fillText(p.char, displacedX - caOffset, displacedY);
          ctx.fillStyle = "rgba(0, 255, 150, 0.8)"; // Green channel
          ctx.fillText(p.char, displacedX, displacedY - caOffset);
          ctx.fillStyle = "rgba(0, 150, 255, 1)"; // Blue channel
          ctx.fillText(p.char, displacedX + caOffset, displacedY + caOffset);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: "rgb(10, 8, 15)",
        cursor: "none",
      }}
    />
  );
}
