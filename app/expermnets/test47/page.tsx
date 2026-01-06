"use client";

import { useEffect, useRef } from "react";

export default function Waves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let t = 0;

    const animate = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Trails
        ctx.fillRect(0,0,w,h);
        
        t += 0.02;
        
        ctx.lineWidth = 2;
        
        const lines = 10;
        for(let l=0; l<lines; l++) {
             ctx.beginPath();
             const yOffset = h/2 + (l - lines/2) * 40;
             const colorVal = l * (360/lines);
             ctx.strokeStyle = `hsl(${colorVal + t*10}, 70%, 50%)`;
             
             for(let x=0; x<w; x+=10) {
                  const y = Math.sin(x * 0.005 + t + l * 0.5) * 50 + 
                           Math.sin(x * 0.01 - t) * 30 +
                           yOffset;
                  if (x===0) ctx.moveTo(x,y);
                  else ctx.lineTo(x,y);
             }
             ctx.stroke();
        }

        requestAnimationFrame(animate);
    }
    
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-white" />;
}
