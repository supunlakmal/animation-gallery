"use client";

import { useEffect, useRef } from "react";

export default function LissajousNet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const cx = w / 2;
    const cy = h / 2;
    let tick = 0;

    const animate = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);
      
      tick += 0.01;

      // Draw patterns
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      
      const curves = 10;
      const step = (Math.PI * 2) / curves;

      ctx.beginPath();
      for (let i = 0; i < curves; i++) {
         const angle = tick + i * step;
         const x = cx + Math.sin(angle * 3) * 300 * Math.cos(tick*0.5);
         const y = cy + Math.cos(angle * 4) * 300 * Math.sin(tick*0.3);
         
         // Draw lines to other points
         for(let j=0; j<curves; j++) {
            if(i===j) continue;
            const angle2 = tick + j * step;
            const x2 = cx + Math.sin(angle2 * 3) * 300 * Math.cos(tick*0.5);
            const y2 = cy + Math.cos(angle2 * 4) * 300 * Math.sin(tick*0.3);
            
            const dist = Math.hypot(x-x2, y-y2);
            if(dist < 200) {
                 ctx.moveTo(x,y);
                 ctx.lineTo(x2,y2); 
            }
         }
      }
      ctx.stroke();

      requestAnimationFrame(animate);
    };
    
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-[#111]" />;
}
