"use client";
import { useEffect, useRef } from "react";

// --- Interface for our single, high-speed drawing pen ---
interface Pen {
  x: number;
  y: number;
  px: number; // Previous position for calculating velocity
  py: number;
}

export default function AttractorConductorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // The state of our chaotic system
  const penRef = useRef<Pen>({ x: 0.1, y: 0.1, px: 0.1, py: 0.1 });
  const paramsRef = useRef({ a: -1.4, b: 1.6, c: 1.0, d: 0.7 });

  // --- Configuration ---
  const config = {
    iterationsPerFrame: 2000, // How many points to calculate each frame
    fadeRate: "rgba(8, 5, 12, 0.05)", // Controls the length of the trails
    scale: 400, // How much to zoom into the attractor
    hue: {
      slow: 200, // Hue for slow movement (blue)
      fast: 0, // Hue for fast movement (red/white)
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Start a new genesis on resize
      handleClick();
    };

    // --- The "Genesis" Event ---
    const handleClick = () => {
      // Clear the canvas
      ctx.fillStyle = "rgb(8, 5, 12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Start the pen at a new random location
      penRef.current = {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        px: 0,
        py: 0,
      };
    };

    // --- The Conductor Interaction ---
    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse position to the four core parameters of the Clifford Attractor
      const mx = e.clientX / canvas.width; // 0 to 1
      const my = e.clientY / canvas.height; // 0 to 1
      paramsRef.current.a = mx * 4 - 2; // -2 to 2
      paramsRef.current.b = my * 4 - 2; // -2 to 2
      paramsRef.current.c = mx * 2 - 1; // -1 to 1 (inverted)
      paramsRef.current.d = my * 2 - 1; // -1 to 1 (inverted)
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMouseMove);

    handleClick(); // Initial Genesis

    // --- Main Animation Loop ---
    const animate = () => {
      const { a, b, c, d } = paramsRef.current;
      let { x, y } = penRef.current;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // --- Performance: Batch drawing ---
      ctx.beginPath();

      for (let i = 0; i < config.iterationsPerFrame; i++) {
        penRef.current.px = x;
        penRef.current.py = y;

        // The Clifford Attractor equations
        const nextX = Math.sin(a * y) + c * Math.cos(a * x);
        const nextY = Math.sin(b * x) + d * Math.cos(b * y);
        x = nextX;
        y = nextY;

        // --- Color based on velocity ---
        const dx = x - penRef.current.px;
        const dy = y - penRef.current.py;
        const speed = Math.sqrt(dx * dx + dy * dy); // 0 to ~0.1
        const speedFactor = Math.min(1, speed * 20); // Normalize to 0-1

        const hue = config.hue.slow + (config.hue.fast - config.hue.slow) * speedFactor;
        const lightness = 60 + 40 * speedFactor; // Gets brighter as it gets faster
        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, 0.5)`;

        // --- Draw line segment ---
        ctx.moveTo(centerX + penRef.current.px * config.scale, centerY + penRef.current.py * config.scale);
        ctx.lineTo(centerX + x * config.scale, centerY + y * config.scale);
      }

      penRef.current.x = x;
      penRef.current.y = y;

      // --- Fade the canvas to create trails ---
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; // This alpha controls trail length
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      // Draw the entire batch of lines
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: "rgb(8, 5, 12)",
        cursor: "crosshair",
      }}
    />
  );
}
