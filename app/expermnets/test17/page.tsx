"use client";
import { useEffect, useRef } from "react";

// --- Interface for each of our three light pens ---
interface ChromaPen {
  x: number;
  y: number;
  px: number; // Previous position for drawing lines
  py: number;
  vx: number;
  vy: number;
  color: string;
}

export default function ChromaWeaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const pensRef = useRef<ChromaPen[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  // --- Configuration ---
  const config = {
    // Physics properties
    mouseSpring: 0.005, // How strongly pens are pulled to the mouse
    penSpring: 0.005, // How strongly pens are pulled to each other
    repulsionForce: -1.5, // The "pluck" force
    damping: 0.95, // Friction for a fluid feel
    // Visual properties
    fadeRate: "rgba(8, 5, 12, 0.1)", // Controls trail length
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
      mouseRef.current.x = canvas.width / 2;
      mouseRef.current.y = canvas.height / 2;

      pensRef.current = [
        { x: canvas.width / 2, y: canvas.height / 2 - 50, px: 0, py: 0, vx: 0, vy: 0, color: "rgba(255, 0, 80, 0.8)" }, // Red
        { x: canvas.width / 2 - 50, y: canvas.height / 2 + 50, px: 0, py: 0, vx: 0, vy: 0, color: "rgba(0, 255, 150, 0.8)" }, // Green
        { x: canvas.width / 2 + 50, y: canvas.height / 2 + 50, px: 0, py: 0, vx: 0, vy: 0, color: "rgba(80, 150, 255, 0.8)" }, // Blue
      ];
    };
    initialize();
    window.addEventListener("resize", initialize);

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
      // --- 1. Fade the canvas to create glowing trails ---
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = config.fadeRate;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 2. Set blend mode for additive light ---
      ctx.globalCompositeOperation = "lighter";

      // --- 3. Update and Draw each Chroma Pen ---
      pensRef.current.forEach((pen, i) => {
        // --- a. Physics Calculation ---
        let forceX = 0;
        let forceY = 0;

        // Spring force towards the mouse
        const dxMouse = mouseRef.current.x - pen.x;
        const dyMouse = mouseRef.current.y - pen.y;
        forceX += dxMouse * config.mouseSpring;
        forceY += dyMouse * config.mouseSpring;

        // Spring force towards other pens
        pensRef.current.forEach((other, j) => {
          if (i === j) return;
          const dxOther = other.x - pen.x;
          const dyOther = other.y - pen.y;
          forceX += dxOther * config.penSpring;
          forceY += dyOther * config.penSpring;
        });

        // "Pluck" repulsion force when mouse is down
        if (mouseRef.current.isDown) {
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse > 1) {
            forceX += (dxMouse / distMouse) * config.repulsionForce;
            forceY += (dyMouse / distMouse) * config.repulsionForce;
          }
        }

        // Apply forces to velocity
        pen.vx += forceX;
        pen.vy += forceY;

        // Apply damping and update position
        pen.vx *= config.damping;
        pen.vy *= config.damping;

        pen.px = pen.x;
        pen.py = pen.y;
        pen.x += pen.vx;
        pen.y += pen.vy;

        // --- b. Drawing ---
        ctx.strokeStyle = pen.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pen.px, pen.py);
        ctx.lineTo(pen.x, pen.y);
        ctx.stroke();

        ctx.fillStyle = pen.color;
        ctx.beginPath();
        ctx.arc(pen.x, pen.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", initialize);
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
        backgroundColor: "rgb(8, 5, 12)",
        cursor: "none",
      }}
    />
  );
}
