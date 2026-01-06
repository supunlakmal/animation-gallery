"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const cols = Math.floor(w / 20);
    const ypos = Array(cols).fill(0);
    const chars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789:・.=\"*+-<>¦｜";

    let animId: number;

    const animate = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#0f0";
      ctx.font = "15px monospace";

      ypos.forEach((y, index) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = index * 20;
        
        // Randomly make some characters white/brighter
        if (Math.random() > 0.98) {
             ctx.fillStyle = "#fff";
        } else {
             ctx.fillStyle = "#0f0";
        }

        ctx.fillText(text, x, y);

        if (y > h + Math.random() * 10000) {
          ypos[index] = 0;
        } else {
          ypos[index] = y + 20;
        }
      });
      
      animId = requestAnimationFrame(animate);
    };

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    animate();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animId);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <canvas ref={canvasRef} />
    </div>
  );
}
