"use client";

import { useEffect, useRef } from "react";

export default function NeonPulseGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const spacing = 40;
      const rows = Math.ceil(canvas.height / spacing);
      const cols = Math.ceil(canvas.width / spacing);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const posX = x * spacing + spacing / 2;
          const posY = y * spacing + spacing / 2;

          const dist = Math.sqrt(
            Math.pow(posX - canvas.width / 2, 2) +
            Math.pow(posY - canvas.height / 2, 2)
          );

          const maxDist = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
          const wave = Math.sin(dist * 0.01 - time) * 0.5 + 0.5; // 0 to 1

          const size = wave * 3 + 1;
          const opacity = wave * 0.8 + 0.2;

          ctx.beginPath();
          ctx.arc(posX, posY, size, 0, Math.PI * 2);
          
          // Color gradient based on distance
          const hue = (dist * 0.1 + time * 50) % 360;
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
          ctx.fill();
        }
      }

      time += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
}
