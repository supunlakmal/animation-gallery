"use client";

import { useEffect, useRef } from "react";

export default function KineticRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const config = {
      ringCount: 15,
      baseRadius: 50,
      radiusStep: 25,
      colorBase: 200,
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const animate = () => {
      time += 0.01;
      
      // Clear with trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < config.ringCount; i++) {
        const radius = config.baseRadius + i * config.radiusStep;
        const segmentCount = 10 + i * 5;
        const speed = (i % 2 === 0 ? 1 : -1) * (0.005 + i * 0.001);
        const rotation = time * speed * 20;
        
        ctx.strokeStyle = `hsl(${(time * 50 + i * 20) % 360}, 70%, 50%)`;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        
        for (let j = 0; j < segmentCount; j++) {
           const angleStep = (Math.PI * 2) / segmentCount;
           const angle = j * angleStep + rotation;
           const arcLen = angleStep * 0.6; // Gap
           
           ctx.beginPath();
           ctx.arc(cx, cy, radius + Math.sin(time + i) * 5, angle, angle + arcLen);
           ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black" />;
}
