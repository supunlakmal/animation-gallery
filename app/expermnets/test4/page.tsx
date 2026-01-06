"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interface for our new "Shavings" ---
interface Shaving {
  x: number;
  y: number;
  vx: number; // Velocity x
  vy: number; // Velocity y
  angle: number;
  baseX: number; // Its "home" position
  baseY: number; // Its "home" position
}

export default function MagneticShavingsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const shavingsRef = useRef<Shaving[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  // --- Configuration for the Magnetic Shavings theme ---
  const config = {
    shavingCount: 4000, // Higher count for a denser field
    magnetStrength: 0.15, // How strongly the mouse attracts/repels
    flowFieldStrength: 0.2, // How much shavings follow the background flow
    returnForce: 0.02, // How strongly shavings return to their base position
    damping: 0.92, // Friction/air resistance for realistic settling
    noiseScale: 0.01, // Large, sweeping patterns in the flow field
    lineLength: 8, // The length of each shaving segment
    lineColor: "rgba(255, 180, 80, 0.8)", // A warm, retro amber
    backgroundColor: "rgb(25, 25, 28)", // Deep charcoal background
  };

  const noise2D = createNoise2D(Math.random);

  // Function to initialize the grid of shavings
  const initializeShavings = (width: number, height: number) => {
    const shavings: Shaving[] = [];
    const density = Math.sqrt((width * height) / config.shavingCount);
    for (let y = 0; y < height; y += density) {
      for (let x = 0; x < width; x += density) {
        shavings.push({
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          angle: 0,
          baseX: x,
          baseY: y,
        });
      }
    }
    return shavings;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      shavingsRef.current = initializeShavings(canvas.width, canvas.height);
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = 1.5;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
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
    const animate = () => {
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath(); // Start a single path for all lines for performance

      shavingsRef.current.forEach((s) => {
        // --- Physics Calculation ---
        const dxMouse = s.x - mouseRef.current.x;
        const dyMouse = s.y - mouseRef.current.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        // Polarity: Attract by default, Repel on mouse down
        const polarity = mouseRef.current.isDown ? 1 : -1;

        // Force from the mouse "magnet"
        const magnetForce = polarity * config.magnetStrength;
        const forceX = (dxMouse / (distMouseSq + 100)) * magnetForce * -100;
        const forceY = (dyMouse / (distMouseSq + 100)) * magnetForce * -100;

        s.vx += forceX;
        s.vy += forceY;

        // Force to return to its original position
        s.vx += (s.baseX - s.x) * config.returnForce;
        s.vy += (s.baseY - s.y) * config.returnForce;

        // Apply damping (friction)
        s.vx *= config.damping;
        s.vy *= config.damping;

        // Update position
        s.x += s.vx;
        s.y += s.vy;

        // --- Angle Calculation ---
        // Angle from the underlying flow field
        const flowAngle = noise2D(s.x * config.noiseScale, s.y * config.noiseScale) * Math.PI;
        // Angle from its own velocity (what direction it's moving)
        const velocityAngle = Math.atan2(s.vy, s.vx);
        // Blend the two for a natural look
        s.angle = flowAngle * config.flowFieldStrength + velocityAngle * (1 - config.flowFieldStrength);

        // --- Drawing ---
        const halfLen = config.lineLength / 2;
        const x1 = s.x + Math.cos(s.angle) * halfLen;
        const y1 = s.y + Math.sin(s.angle) * halfLen;
        const x2 = s.x - Math.cos(s.angle) * halfLen;
        const y2 = s.y - Math.sin(s.angle) * halfLen;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      });

      ctx.stroke(); // Draw all the lines in one go

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
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
        backgroundColor: config.backgroundColor,
        cursor: "default",
      }}
    />
  );
}
