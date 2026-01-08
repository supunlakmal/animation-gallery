"use client";

import { useEffect, useRef } from "react";

export default function WaveSynthesis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const animate = (time: number) => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const waves = 5;
      const t = time * 0.001;

      for (let i = 0; i < waves; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `hsla(${200 + i * 20}, 80%, 60%, ${0.2 + (i / waves) * 0.5})`;

        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + 
            Math.sin(x * 0.005 + t + i) * 50 * Math.sin(t * 0.5 + i) +
            Math.cos(x * 0.002 - t * 0.8 + i * 2) * 30;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {};
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#050505]" />;
}
