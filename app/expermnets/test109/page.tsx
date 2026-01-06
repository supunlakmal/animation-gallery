"use client";
import { useEffect, useRef } from "react";

export default function Kaleidoscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    let hue = 0;
    
    // Auto draw logic
    let x = 0; 
    let y = 0;
    let angle = 0;
    
    const animate = () => {
      // Don't clear, just draw over
      // Fade out slowly
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, width, height);

      // Calculate a point
      // Lissajous figure
      angle += 0.05;
      const r = 200 * Math.sin(angle * 0.3);
      x = width/2 + r * Math.cos(angle);
      y = height/2 + r * Math.sin(angle * 2);

      hue++;
      ctx.strokeStyle = `hsl(${hue % 360}, 50%, 50%)`;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";

      // Draw mirrored
      const cx = width / 2;
      const cy = height / 2;
      
      const segments = 8;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const originalAngle = Math.atan2(dy, dx);
      
      ctx.beginPath();
      for(let i=0; i<segments; i++) {
        const theta = originalAngle + (Math.PI * 2 / segments) * i;
        const px = cx + Math.cos(theta) * dist;
        const py = cy + Math.sin(theta) * dist;
        
        // Draw just a dot or a line from previous?
        // Let's just draw dots for now to make "streamers"
        ctx.moveTo(px, py);
        ctx.lineTo(px + 2, py + 2); // Tiny line
      }
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,width,height);
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
