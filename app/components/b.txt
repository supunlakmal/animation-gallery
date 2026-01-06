"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// Interface for our "Ink Wisps"
interface Wisp {
  x: number;
  y: number;
  px: number; // Previous x
  py: number; // Previous y
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const wispsRef = useRef<Wisp[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Configuration ---
  const config = {
    wispCount: 400,
    noiseScale: 0.003, // How "zoomed-in" the flow field is
    noiseStrength: 0.5, // How much the field influences direction
    wispSpeed: 1.5,
    fadeRate: "rgba(242, 240, 235, 0.08)", // The background color + alpha for the fade effect
    lineColor: { r: 50, g: 80, b: 120 }, // Base color for the ink
    mouseSpawnRate: 4, // How many wisps to spawn on mouse move
  };

  const noise2D = createNoise2D(Math.random);

  // Function to create or reset a wisp
  const resetWisp = (wisp?: Wisp, x?: number, y?: number): Wisp => {
    const angle = Math.random() * Math.PI * 2;
    const newWisp = wisp || ({} as Wisp);

    newWisp.x = x ?? Math.random() * window.innerWidth;
    newWisp.y = y ?? Math.random() * window.innerHeight;
    newWisp.px = newWisp.x;
    newWisp.py = newWisp.y;
    newWisp.angle = angle;
    newWisp.speed = Math.random() * 0.5 + config.wispSpeed;
    newWisp.maxLife = Math.random() * 100 + 150;
    newWisp.life = newWisp.maxLife;

    return newWisp;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round"; // Smoother lines
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize wisps
    wispsRef.current = Array.from({ length: config.wispCount }, () => resetWisp());

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true };

      // Spawn wisps at mouse location
      for (let i = 0; i < config.mouseSpawnRate; i++) {
        const wispIndex = Math.floor(Math.random() * config.wispCount);
        resetWisp(wispsRef.current[wispIndex], e.clientX, e.clientY);
      }

      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
      mouseMoveTimeoutRef.current = setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleClick = (e: MouseEvent) => {
      // Create a burst of 30 wisps on click
      for (let i = 0; i < 30; i++) {
        const wispIndex = Math.floor(Math.random() * config.wispCount);
        resetWisp(wispsRef.current[wispIndex], e.clientX, e.clientY);
      }
    };
    window.addEventListener("click", handleClick);

    // --- Animation Loop ---
    const animate = (timestamp: number) => {
      // 1. Fade the canvas to create trails
      ctx.fillStyle = config.fadeRate;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Update and draw each wisp
      wispsRef.current.forEach((wisp) => {
        // Store previous position
        wisp.px = wisp.x;
        wisp.py = wisp.y;

        // Get angle from noise field
        const noiseAngle = noise2D(wisp.x * config.noiseScale, wisp.y * config.noiseScale) * Math.PI * 2;

        // Blend current angle with noise angle for smooth turning
        wisp.angle += (noiseAngle - wisp.angle) * config.noiseStrength * 0.1;

        // Move the wisp
        wisp.x += Math.cos(wisp.angle) * wisp.speed;
        wisp.y += Math.sin(wisp.angle) * wisp.speed;

        // Decrease life
        wisp.life--;

        // Boundary conditions (wrap around screen)
        if (wisp.x < 0) {
          wisp.x = wisp.px = canvas.width;
        }
        if (wisp.x > canvas.width) {
          wisp.x = wisp.px = 0;
        }
        if (wisp.y < 0) {
          wisp.y = wisp.py = canvas.height;
        }
        if (wisp.y > canvas.height) {
          wisp.y = wisp.py = 0;
        }

        // Reset wisp if its life is over
        if (wisp.life <= 0) {
          resetWisp(wisp);
        }

        // Draw the wisp
        const opacity = wisp.life / wisp.maxLife;
        ctx.strokeStyle = `rgba(${config.lineColor.r}, ${config.lineColor.g}, ${config.lineColor.b}, ${opacity * 0.8})`;
        ctx.lineWidth = opacity * 2.5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(wisp.px, wisp.py);
        ctx.lineTo(wisp.x, wisp.y);
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
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        // This is the starting background color, the fade effect is controlled in the config
        backgroundColor: "rgb(242, 240, 235)",
      }}
    />
  );
}
