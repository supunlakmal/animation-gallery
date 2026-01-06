"use client";
import { useEffect, useRef } from "react";

export default function SpiderWeb() {
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

    const points: {x: number, y: number, vx: number, vy: number}[] = [];
    const count = 50;
    
    for(let i=0; i<count; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    
    let mouse = { x: 0, y: 0 };

    const animate = () => {
      ctx.fillStyle = "#eee";
      ctx.fillRect(0, 0, width, height);

      // Points move
      points.forEach(p => {
         p.x += p.vx;
         p.y += p.vy;
         
         if(p.x < 0 || p.x > width) p.vx *= -1;
         if(p.y < 0 || p.y > height) p.vy *= -1;
      });
      
      // Connect to mouse
      points.forEach(p => {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < 200) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,0,0, ${1 - d/200})`;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
          }
      });
      
      // Connect to each other
      for(let i=0; i<count; i++) {
          for(let j=i+1; j<count; j++) {
              const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
              if (d < 100) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(0,0,0, ${0.5 * (1 - d/100)})`;
                  ctx.moveTo(points[i].x, points[i].y);
                  ctx.lineTo(points[j].x, points[j].y);
                  ctx.stroke();
              }
          }
      }
      
      // Draw points
      ctx.fillStyle = "black";
      points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
          ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMove);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#eee] -z-10" />;
}
