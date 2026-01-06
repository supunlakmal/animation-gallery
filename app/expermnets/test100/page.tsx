"use client";
import { useEffect, useRef } from "react";

interface String {
  x: number;
  y: number;
  len: number;
  color: string;
  amplitude: number;
  frequency: number;
  phase: number;
  damping: number;
  targetAmp: number;
}

export default function NeonStrings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let strings: String[] = [];
    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      strings = [];
      const gap = 40;
      const count = Math.ceil(width / gap);

      for (let i = 0; i < count; i++) {
        strings.push({
          x: i * gap + gap / 2,
          y: 0,
          len: height,
          color: `hsl(${i * 5}, 80%, 60%)`, // Gradient colors
          amplitude: 0,
          frequency: 0.05 + Math.random() * 0.05,
          phase: Math.random() * Math.PI * 2,
          damping: 0.95,
          targetAmp: 0,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Mouse velocity interaction
      const mouseVelX = Math.abs(mouseX - prevMouseX);
      const mouseVelY = Math.abs(mouseY - prevMouseY);
      const totalVel = Math.sqrt(mouseVelX ** 2 + mouseVelY ** 2);

      strings.forEach((str) => {
        // Check collision with mouse
        // Simple distance check from string X to mouse X
        const dist = Math.abs(mouseX - str.x);
        
        // If mouse is close and moving fast, pluck the string
        if (dist < 20 && totalVel > 5) {
          str.amplitude = Math.min(str.amplitude + totalVel * 2, 100);
        }

        // Physics
        str.amplitude *= str.damping;
        str.phase += 0.2;

        ctx.beginPath();
        ctx.strokeStyle = str.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = str.color;

        // Draw sine wave for vibrating string
        for (let y = 0; y < height; y += 5) {
          // Envelope to pin ends? Naa, let's just let it vibrate horizontally
          // Or pin at top/bottom for guitar string feel
          const stringPos = y / height; // 0 to 1
          const envelope = Math.sin(stringPos * Math.PI); // 0 at ends, 1 in center
          
          const xOffset = Math.sin(y * str.frequency + str.phase) * str.amplitude * envelope;
          
          if (y === 0) ctx.moveTo(str.x, y);
          else ctx.lineTo(str.x + xOffset, y);
        }
        ctx.stroke();
      });

      prevMouseX = mouseX;
      prevMouseY = mouseY;
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
