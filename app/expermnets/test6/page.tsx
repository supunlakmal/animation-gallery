"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Interface for each vertex of our geometric entity ---
interface Vertex {
  x: number; // Current x position
  y: number; // Current y position
  baseX: number; // Its original "home" x position on the shape
  baseY: number; // Its original "home" y position on the shape
  angle: number; // The angle from the center (for pulsing)
  radius: number; // The radius from the center
  vx: number; // Velocity for smooth motion
  vy: number;
}

export default function BreathingApertureBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const polygonsRef = useRef<Vertex[][]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pulseRef = useRef({ strength: 0, decay: 0.95 });

  // --- Configuration for the Aperture ---
  const config = {
    polygonCount: 8, // Number of concentric layers
    baseSides: 3, // Number of sides for the innermost shape
    mouseInfluence: 0.08, // How strongly the mouse warps the shape
    returnForce: 0.015, // How strongly vertices return to their base position
    damping: 0.94, // Friction for smooth settling
    noiseScale: 0.003, // How "detailed" the breathing motion is
    noiseStrength: 0.1, // How much the aperture breathes
    pulseStrength: 150, // The initial force of a click pulse
    glowColor: "hsl(190, 100%, 75%)", // The ethereal glow color
    backgroundColor: "rgb(5, 2, 8)", // A deep, near-black cosmic purple
  };

  const noise2D = createNoise2D(Math.random);

  // Function to initialize the geometric structure
  const initializePolygons = (centerX: number, centerY: number, maxRadius: number) => {
    const polygons: Vertex[][] = [];
    for (let i = 0; i < config.polygonCount; i++) {
      const vertices: Vertex[] = [];
      const radius = maxRadius * ((i + 1) / config.polygonCount);
      const sides = config.baseSides + i;
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        vertices.push({ x, y, baseX: x, baseY: y, angle, radius, vx: 0, vy: 0 });
      }
      polygons.push(vertices);
    }
    return polygons;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      polygonsRef.current = initializePolygons(canvas.width / 2, canvas.height / 2, maxRadius);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleClick = () => {
      pulseRef.current.strength = config.pulseStrength;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = (timestamp: number) => {
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Update Pulse ---
      pulseRef.current.strength *= pulseRef.current.decay;

      // --- Update and Draw Polygons ---
      polygonsRef.current.forEach((vertices, polyIndex) => {
        // --- Update each vertex ---
        vertices.forEach((v) => {
          // 1. Force from mouse
          const dxMouse = v.x - mouseRef.current.x;
          const dyMouse = v.y - mouseRef.current.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          v.vx -= (dxMouse / (distMouse + 100)) * config.mouseInfluence;
          v.vy -= (dyMouse / (distMouse + 100)) * config.mouseInfluence;

          // 2. Force to return home
          v.vx += (v.baseX - v.x) * config.returnForce;
          v.vy += (v.baseY - v.y) * config.returnForce;

          // 3. Force from noise field (breathing)
          const noiseValue = noise2D(v.baseX * config.noiseScale, v.baseY * config.noiseScale + timestamp * 0.0001);
          v.vx += Math.cos(v.angle) * noiseValue * config.noiseStrength;
          v.vy += Math.sin(v.angle) * noiseValue * config.noiseStrength;

          // 4. Force from pulse
          v.vx += Math.cos(v.angle) * pulseRef.current.strength * (v.radius / 1000);
          v.vy += Math.sin(v.angle) * pulseRef.current.strength * (v.radius / 1000);

          // Apply damping and update position
          v.vx *= config.damping;
          v.vy *= config.damping;
          v.x += v.vx;
          v.y += v.vy;
        });

        // --- Draw each polygon ---
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();

        const opacity = 1 - polyIndex / config.polygonCount;
        const brightness = 70 + (pulseRef.current.strength / config.pulseStrength) * 30;

        ctx.strokeStyle = `hsla(190, 100%, ${brightness}%, ${opacity * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = config.glowColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
      });

      // Reset shadow for other elements
      ctx.shadowBlur = 0;

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
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: config.backgroundColor,
        cursor: "none",
      }}
    />
  );
}
