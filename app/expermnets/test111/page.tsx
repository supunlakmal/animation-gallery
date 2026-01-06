"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function FlowFieldV2() {
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

    const noise2D = createNoise2D();
    
    interface Particle {
        x: number; 
        y: number;
        vx: number;
        vy: number;
        color: string;
        life: number;
    }
    
    let particles: Particle[] = [];
    
    const initParticles = () => {
        particles = [];
        for(let i=0; i<300; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: 0,
                vy: 0,
                color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`, // Blues
                life: Math.random() * 100
            });
        }
    };
    
    initParticles();
    
    let time = 0;

    const animate = () => {
      // Trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      
      time += 0.005;

      particles.forEach(p => {
         const angle = noise2D(p.x * 0.005, p.y * 0.005 + time) * Math.PI * 2;
         
         p.vx += Math.cos(angle) * 0.5;
         p.vy += Math.sin(angle) * 0.5;
         
         p.vx *= 0.9;
         p.vy *= 0.9;
         
         p.x += p.vx;
         p.y += p.vy;
         
         if(p.x < 0) p.x = width;
         if(p.x > width) p.x = 0;
         if(p.y < 0) p.y = height;
         if(p.y > height) p.y = 0;
         
         ctx.beginPath();
         // Vary line width based on speed
         const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
         ctx.lineWidth = speed * 2;
         ctx.strokeStyle = p.color;
         ctx.moveTo(p.x, p.y);
         ctx.lineTo(p.x - p.vx*2, p.y - p.vy*2);
         ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
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
