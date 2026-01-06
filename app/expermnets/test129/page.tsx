"use client";
import { useEffect, useRef } from "react";

export default function CircuitBoard() {
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

    interface Tracer {
        x: number;
        y: number;
        dir: number; // 0: right, 1: down, 2: left, 3: up
        color: string;
        alive: boolean;
    }
    
    let tracers: Tracer[] = [];
    
    const init = () => {
        tracers = [];
        for(let i=0; i<20; i++) {
            tracers.push({
                x: Math.random() * width,
                y: Math.random() * height,
                dir: Math.floor(Math.random() * 4),
                color: "#0f0",
                alive: true
            });
        }
        ctx.fillStyle = "#001000";
        ctx.fillRect(0,0,width,height);
    };
    
    init();

    const animate = () => {
      // Don't clear
      
      tracers.forEach(t => {
          if (!t.alive) {
              // Rebirth
              if(Math.random() > 0.99) {
                  t.x = Math.random() * width;
                  t.y = Math.random() * height;
                  t.alive = true;
              }
              return;
          }
          
          const speed = 5;
          const oldX = t.x;
          const oldY = t.y;
          
          if (t.dir === 0) t.x += speed;
          else if (t.dir === 1) t.y += speed;
          else if (t.dir === 2) t.x -= speed;
          else if (t.dir === 3) t.y -= speed;
          
          ctx.beginPath();
          ctx.strokeStyle = t.color;
          ctx.lineWidth = 2;
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
          
          // Turn logic
          if (Math.random() > 0.95) {
              const turn = Math.random() > 0.5 ? 1 : 3; // +90 or -90
              t.dir = (t.dir + turn) % 4;
              
              // Draw node dot
              ctx.beginPath();
              ctx.fillStyle = t.color;
              ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
              ctx.fill();
          }
          
          // Die if out of bounds
          if (t.x < 0 || t.x > width || t.y < 0 || t.y > height) t.alive = false;
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#001000] -z-10" />;
}
