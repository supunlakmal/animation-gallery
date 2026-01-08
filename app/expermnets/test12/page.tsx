"use client";
import { useEffect, useRef } from "react";

// --- Interface for each character in our physical grid ---
interface Glyph {
  x: number;
  y: number;
  homeX: number; // Its original grid position
  homeY: number;
  vx: number; // Velocity
  vy: number;
  char: string;
  stress: number; // How far it is from home
}

export default function GlyphWeaverBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const glyphsRef = useRef<Glyph[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, isDown: false, speed: 0, px: 0, py: 0 });

  // --- Configuration ---
  const config = {
    gridSize: 25,
    mouseRadius: 200,
    attractionForce: 0.01,
    repulsionForce: -0.02,
    returnForce: 0.005, // Spring stiffness
    damping: 0.9, // Friction
    strumMultiplier: 10, // How much fast movements affect stress
    chars: "日文字記号アットマークブラケット", // A selection of Katakana for aesthetic
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
      glyphsRef.current = [];
      for (let y = 0; y < canvas.height; y += config.gridSize) {
        for (let x = 0; x < canvas.width; x += config.gridSize) {
          glyphsRef.current.push({
            x: x,
            y: x,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            char: config.chars[Math.floor(Math.random() * config.chars.length)],
            stress: 0,
          });
        }
      }
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const dx = mouseRef.current.x - mouseRef.current.px;
      const dy = mouseRef.current.y - mouseRef.current.py;
      mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);
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
      ctx.fillStyle = "rgba(8, 5, 12, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const forceType = mouseRef.current.isDown ? config.repulsionForce : config.attractionForce;

      glyphsRef.current.forEach((glyph) => {
        // --- Physics Calculation ---
        // 1. Force from mouse
        const dxMouse = glyph.x - mouseRef.current.x;
        const dyMouse = glyph.y - mouseRef.current.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < config.mouseRadius * config.mouseRadius) {
          const distMouse = Math.sqrt(distMouseSq);
          const force = (1 - distMouse / config.mouseRadius) * forceType;
          glyph.vx += (dxMouse / distMouse) * force;
          glyph.vy += (dyMouse / distMouse) * force;
        }

        // 2. Spring force to return home
        glyph.vx += (glyph.homeX - glyph.x) * config.returnForce;
        glyph.vy += (glyph.homeY - glyph.y) * config.returnForce;

        // 3. Apply damping and update position
        glyph.vx *= config.damping;
        glyph.vy *= config.damping;
        glyph.x += glyph.vx;
        glyph.y += glyph.vy;

        // --- Stress Calculation ---
        const dxHome = glyph.x - glyph.homeX;
        const dyHome = glyph.y - glyph.homeY;
        const homeDist = Math.sqrt(dxHome * dxHome + dyHome * dyHome);
        const baseStress = Math.min(1, homeDist / 100);

        // "Strum" effect adds stress based on mouse speed
        const strumStress = (mouseRef.current.speed * config.strumMultiplier) / (distMouseSq + 1000);

        glyph.stress = Math.min(1, baseStress + strumStress);
      });

      // --- Drawing (batched for performance) ---
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      glyphsRef.current.forEach((glyph) => {
        if (glyph.stress > 0.01) {
          const hue = 220; // Cool Blue
          const saturation = 100 - glyph.stress * 50; // Desaturates to white
          const lightness = 60 + glyph.stress * 40; // Becomes brighter

          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.font = `${10 + glyph.stress * 10}px 'Fira Code', monospace`;
          ctx.globalAlpha = glyph.stress * 0.8 + 0.2;
          ctx.fillText(glyph.char, glyph.x, glyph.y);
        }
      });
      ctx.globalAlpha = 1.0;

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
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
