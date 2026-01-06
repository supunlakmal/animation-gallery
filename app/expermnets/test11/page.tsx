"use client";
import { useEffect, useRef } from "react";

// --- Interfaces for our light-blocking objects ---
interface Occluder {
  x: number;
  y: number;
  radius: number;
}

interface OrbitingOccluder extends Occluder {
  angle: number;
  speed: number;
  distance: number;
}

interface PulseOccluder extends Occluder {
  life: number;
  maxLife: number;
}

export default function UmbralEngineBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // State of the light simulation
  const mouseOccluderRef = useRef<Occluder>({ x: -9999, y: -9999, radius: 60 });
  const orbitingOccludersRef = useRef<OrbitingOccluder[]>([]);
  const pulseOccludersRef = useRef<PulseOccluder[]>([]);

  // --- Configuration ---
  const config = {
    rayCount: 700, // Number of light rays. More is prettier, less is more performant.
    starRadius: 100,
    mouseRadius: 60,
    pulseInitialRadius: 20,
    pulseMaxRadius: 400,
    pulseLife: 120, // in frames
    hue: 200, // The base color of the light
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

      // Create a few orbiting occluders for ambient motion
      orbitingOccludersRef.current = [
        { x: 0, y: 0, radius: 25, angle: Math.random() * 360, speed: 0.003, distance: 200 },
        { x: 0, y: 0, radius: 15, angle: Math.random() * 360, speed: -0.005, distance: 350 },
        { x: 0, y: 0, radius: 40, angle: Math.random() * 360, speed: 0.002, distance: 500 },
      ];
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseOccluderRef.current.x = e.clientX;
      mouseOccluderRef.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      pulseOccludersRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: config.pulseInitialRadius,
        life: config.pulseLife,
        maxLife: config.pulseLife,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // --- 1. Update Occluder Positions ---
      // Update orbiters
      orbitingOccludersRef.current.forEach((o) => {
        o.angle += o.speed;
        o.x = centerX + Math.cos(o.angle) * o.distance;
        o.y = centerY + Math.sin(o.angle) * o.distance;
      });
      // Update and filter pulses
      pulseOccludersRef.current = pulseOccludersRef.current.filter((p) => p.life > 0);
      pulseOccludersRef.current.forEach((p) => {
        p.life--;
        const lifeRatio = p.life / p.maxLife;
        p.radius = config.pulseMaxRadius * (1 - lifeRatio * lifeRatio);
      });

      const allOccluders = [mouseOccluderRef.current, ...orbitingOccludersRef.current, ...pulseOccludersRef.current];

      // --- 2. Calculate Shadow Angles ---
      const shadowAngles: [number, number][] = [];
      allOccluders.forEach((o) => {
        const dx = o.x - centerX;
        const dy = o.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < o.radius) return; // Inside the star, casts no shadow

        const angle = Math.atan2(dy, dx);
        const angleSpread = Math.asin(o.radius / dist);
        shadowAngles.push([angle - angleSpread, angle + angleSpread]);
      });

      // --- 3. Render the Scene ---
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgb(8, 5, 12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Use "lighter" to make rays additively blend for a glowing effect
      ctx.globalCompositeOperation = "lighter";

      // --- 4. Draw the God Rays ---
      for (let i = 0; i < config.rayCount; i++) {
        const rayAngle = (i / config.rayCount) * Math.PI * 2;

        // Check if this ray is inside any shadow
        let inShadow = false;
        for (const shadow of shadowAngles) {
          // Handle angle wrapping around PI
          if (shadow[0] < -Math.PI && rayAngle > Math.PI - (Math.abs(shadow[0]) - Math.PI)) {
            if (rayAngle > shadow[1] + 2 * Math.PI || rayAngle < shadow[1]) {
              inShadow = true;
              break;
            }
          } else if (shadow[1] > Math.PI && rayAngle < -Math.PI + (shadow[1] - Math.PI)) {
            if (rayAngle < shadow[0] - 2 * Math.PI || rayAngle > shadow[0]) {
              inShadow = true;
              break;
            }
          } else if (rayAngle > shadow[0] && rayAngle < shadow[1]) {
            inShadow = true;
            break;
          }
        }

        if (inShadow) continue;

        const rayLength = Math.max(canvas.width, canvas.height) * 1.5;
        const endX = centerX + Math.cos(rayAngle) * rayLength;
        const endY = centerY + Math.sin(rayAngle) * rayLength;

        const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
        gradient.addColorStop(0, `hsla(${config.hue}, 100%, 80%, 0.1)`);
        gradient.addColorStop(0.1, `hsla(${config.hue}, 100%, 80%, 0.1)`);
        gradient.addColorStop(1, `hsla(${config.hue}, 100%, 80%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // --- 5. Draw the Central Star ---
      ctx.globalCompositeOperation = "source-over";
      const starGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, config.starRadius);
      starGradient.addColorStop(0, "hsla(0, 100%, 100%, 1)");
      starGradient.addColorStop(0.5, `hsla(${config.hue}, 100%, 80%, 1)`);
      starGradient.addColorStop(1, `hsla(${config.hue}, 100%, 80%, 0)`);
      ctx.fillStyle = starGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, config.starRadius, 0, Math.PI * 2);
      ctx.fill();

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
