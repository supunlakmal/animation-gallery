"use client";

import { useEffect, useRef } from "react";

export default function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Star {
       radius: number;
       angle: number;
       speed: number;
       color: string;
       
       constructor() {
          this.radius = Math.random() * 400;
          this.angle = Math.random() * Math.PI * 2;
          this.speed = (500 / (this.radius + 10)) * 0.02; // Inner stars faster
          // Galaxy coloring
          const r = Math.floor(Math.random() * 50 + 200);
          const g = Math.floor(Math.random() * 50 + 100);
          const b = Math.floor(Math.random() * 100 + 155);
          this.color = `rgb(${r},${g},${b})`;
       }

       update() {
          this.angle += this.speed;
       }

       draw() {
          if (!ctx) return;
          const cx = w/2;
          const cy = h/2;
          // Apply tilt
          const x = cx + Math.cos(this.angle) * this.radius;
          const y = cy + Math.sin(this.angle) * this.radius * 0.6; // Flatten for 3D effect
          
          const size = Math.random() < 0.9 ? 1 : 2;
          ctx.fillStyle = this.color;
          ctx.fillRect(x,y,size,size);
       }
    }

    const stars = Array.from({length: 1500}, () => new Star());

    const animate = () => {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0,0,w,h);
        
        stars.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animate);
    }
    
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-black" />;
}
